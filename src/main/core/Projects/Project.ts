/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Item }      from '../Storage/Item';
import { glob }      from 'glob';
import fs            from 'fs/promises';
import * as fsSync   from 'fs';
import path          from 'path';
import PM_FileSystem from '../Utils/PM_FileSystem';
import APP           from '../../main';
import rng           from 'seedrandom';
import JSON5         from 'json5';

export class Project extends Item {
	public table: string = 'projects';

	public static externalProps = [
		'ide',//string
		'name',//string
		'logo',//string
		'color'//string
	];

	init() {
		this.setVal('logo', '', true);
		this.setVal('name', '', true);
	}

	afterInit(data: any) {
		if (!data.color) {
			const backgroundColors = [
				'#F44336', '#E91E63', '#9C27B0',
				'#673AB7', '#3F51B5', '#2196F3',
				'#03A9F4', '#00BCD4', '#009688',
				'#4CAF50', '#8BC34A', '#CDDC39',
				'#FFEB3B', '#FFC107', '#FF9800',
				'#FF5722', '#795548', '#607D8B'
			];
			const color            = backgroundColors[Math.floor(rng(data.path)() * (backgroundColors.length - 1))];
			this.setVal('color', color);
		}
	}

	async analyzeFolder() {
		const promises = [];
		promises.push(this.analyzeIcon());
		promises.push(this.statTechnologies());
		await Promise.all(promises);
		return this;
	}

	setVal<T = any>(key: string, value: T, init: boolean = false) {
		if (init) {
			super.setVal(key, value);
			return;
		}
		if (Project.externalProps?.includes(key)) {
			try {
				const confPath = path.join(this.getVal('path'), '.project-manager', 'config.json');
				let config     = JSON5.parse(fsSync.readFileSync(confPath).toString()) || {};
				config[key]    = value;
				fsSync.writeFileSync(confPath, JSON.stringify(config));
			} catch (e) {
			} finally {
				super.setVal(key, value);
			}
		} else {
			super.setVal(key, value);

		}
	}

	getVal<T = any>(key: string): T {
		if (Project.externalProps?.includes(key)) {
			try {
				const confPath                 = path.join(super.getVal('path'), '.project-manager', 'config.json');
				let config: { [p: string]: T } = JSON5.parse(fsSync.readFileSync(confPath).toString()) || {};
				return config[key] || this.data[key];
			} catch (e) {
				return super.getVal(key);
			}
		} else {
			return super.getVal(key);
		}
	}

	save(): number {
		const id = super.save();
		APP.sendRenderEvent('electron-project-update');
		return id;

	}

	toObject() {
		const results: any = {};
		for (const dataKey in this.data) {
			results[dataKey] = this.getVal(dataKey);
		}
		return results;
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
		this.setVal('logo', await PM_FileSystem.logoToBase64(newIcons.pop()));
	}

}
