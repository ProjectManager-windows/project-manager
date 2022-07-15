/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Item }        from '../Storage/Item';
import { glob }        from 'glob';
import fs              from 'fs/promises';
import path            from 'path';
import PM_FileSystem   from '../Utils/PM_FileSystem';
import sendRenderEvent from '../../main';

export class Project extends Item {
	public table: string = 'projects';

	init() {
		this.setVal('logo', '');
		this.setVal('name', '');
		this.setVal('name', '');
	}

	async analyzeFolder() {
		const promises = [];
		promises.push(this.analyzeIcon());
		promises.push(this.statTechnologies());
		await Promise.all(promises);
		return this;
	}

	private async statTechnologies() {
		const files                            = await (new PM_FileSystem).getFiles(this.getVal('path'));
		const stats: { [key: string]: number } = {};
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			// eslint-disable-next-line no-prototype-builtins
			if (!stats.hasOwnProperty(file.ext)) {
				stats[file.ext] = 0;
			}
			stats[file.ext] += file.size;
		}
		this.setVal('stats', stats);
	}

	private async analyzeIcon() {
		const icons: string[] = await new Promise((resolve, reject) => {
			glob('**/@(favicon.ico|favicon.jpg|favicon.png|favicon.svg|icon.png|icon.svg|icon.jpg|icon.ico|logo.ico|logo.jpg|logo.png|logo.svg)', {
				cwd     : this.getVal('path'),
				silent  : true,
				nodir   : true,
				realpath: true
			}, (er, files) => {
				if (er) {
					reject(er);
					return;
				}
				resolve(files);
			});
		});
		let newIcons: {
			path: string
			size: number
			ext: string
			name: string
		}[]                   = [];
		const promises: any[] = [];
		for (const iconKey in icons) {
			const icon = icons[iconKey];
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			promises.push((async () => {
				const stat = await fs.stat(icon);
				const ext  = path.extname(icon);
				newIcons.push({
								  path: icon,
								  size: stat.size,
								  ext : ext,
								  name: path.basename(icon).replace(ext, '')
							  });
			})());
		}
		await Promise.all(promises);
		newIcons = newIcons.sort((a, b) => {
			if (a.ext === '.svg') return Infinity;
			if (b.ext === '.svg') return Infinity;
			if (a.ext === b.ext) {
				if (a.size === b.size) return 0;
				return (a.size > b.size) ? 1 : -1;
			}
			const exts: { [key: string]: number }
						 = {
				'.ico': 1,
				'.jpg': 2,
				'.png': 4
			};
			const names: { [key: string]: number }
						 = {
				'icon'   : 1,
				'favicon': 2,
				'logo'   : 4
			};
			const scoreA = (exts[a.ext] > exts[b.ext]) ? 1 : -1;
			const scoreB = scoreA * -1;

			const score2A = (names[a.name] > names[b.name]) ? 1 : -1;
			const score2B = scoreA * -1;
			if (a.size === b.size) return scoreA;
			return (Math.log(a.size) * (scoreA + score2A) > Math.log(b.size) * (scoreB + score2B)) ? 1 : -1;
		});
		this.setVal('logo', await Project.logoToBase64(newIcons.pop()));
	}

	private static async logoToBase64(logo?: {
		path: string
		size: number
		ext: string
	}) {
		if (!logo) {
			return '';
		}
		const data = await fs.readFile(logo.path);
		switch (logo.ext) {
			case '.svg':
				return `data:image/svg+xml;base64,${data.toString('base64')}`;
			case '.jpg':
				return `data:image/jpg;base64,${data.toString('base64')}`;
			case '.png':
				return `data:image/png;base64,${data.toString('base64')}`;
			case '.ico':
				return `data:image/ico;base64,${data.toString('base64')}`;
			default:
				return '';
		}
	}

	save(): number {
		const id = super.save();
		sendRenderEvent('electron-project-update');
		return id;

	}

}
