/* eslint-disable @typescript-eslint/lines-between-class-members */
import { glob }                                                from 'glob';
import fs                                                      from 'fs/promises';
import * as fsSync                                             from 'fs';
import path                                                    from 'path';
import rng                                                     from 'seedrandom';
import JSON5                                                   from 'json5';
import ignore                                                  from 'ignore';
import { Item, ItemType }                                      from '../Storage/Item';
import PM_FileSystem, { file }                                 from '../Utils/PM_FileSystem';
import APP                                                     from '../../main';
import { Tables }                                              from '../Storage/PM_Storage';
import { BackgroundEvents }                                    from '../../../types/Events';
import { ProjectAllProps, ProjectExternalProps, ProjectProps } from '../../../types/project';

export class Project extends Item {
	public data: ItemType & ProjectProps = { id: 0 };

	public table = Tables.projects;

	public constructor(data: ItemType & ProjectProps) {
		super(data);
		this.init();
		this.data = data;
		this.afterInit(data);
	}

	public static externalProps: Array<keyof ProjectExternalProps> = [
		'ide',// string
		'terminal',// string
		'name',// string
		'logo',// string
		'logoBaseName',// string
		'color',// string
		'description',// string
		'env'// object
	];

	init() {
		this.setVal('logo', '', true);
		this.setVal('name', '', true);
		this.setVal('description', '', true);
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
		promises.push(this.statLanguages());
		await Promise.all(promises);
		return this;
	}

	setVal<T = any>(key: keyof ProjectAllProps, value: T, init = false) {
		if (init) {
			super.setVal(key, value);
			return this;
		}
		if (key === 'logo') {
			const confPath = path.join(this.getVal('path'), '.project-manager', 'logo.base64');
			fsSync.writeFileSync(confPath, String(value));
			return this;
		}
		if (key === 'env') {
			try {
				const confPath = path.join(super.getVal('path'), '.project-manager', 'env.toml');
				fsSync.writeFileSync(confPath, String(value));
			} catch (e) {
				super.setVal(key, value);
			}
			return this;
		}
		if (Project.externalProps?.includes(key as keyof ProjectExternalProps)) {
			try {
				const confPath = path.join(this.getVal('path'), '.project-manager', 'config.json');
				const config   = JSON5.parse(fsSync.readFileSync(confPath).toString()) || {};
				config[key]    = value;
				fsSync.writeFileSync(confPath, JSON.stringify(config));
			} catch (e) {
			} finally {
				super.setVal(key, value);
			}
		} else {
			super.setVal(key, value);

		}
		return this;
	}

	getVal<T = any>(key: keyof ProjectAllProps): T {
		if (key === 'logo') {
			if (this.getVal('logoBaseName')) {
				const confPath = path.join(super.getVal('path'), '.project-manager', this.getVal('logoBaseName')).replaceAll('\\', '/');
				return `file://${confPath}` as unknown as T;
			}
			return '' as unknown as T;
		}
		if (key === 'env') {
			const confPath = path.join(super.getVal('path'), '.project-manager', 'env.toml');
			try {
				return fsSync.readFileSync(confPath).toString() as unknown as T;
			} catch (e) {
				return super.getVal(key);
			}
		}
		if (Project.externalProps?.includes(key as keyof ProjectExternalProps)) {
			try {
				const confPath                   = path.join(super.getVal('path'), '.project-manager', 'config.json');
				const config: { [p: string]: T } = JSON5.parse(fsSync.readFileSync(confPath).toString()) || {};
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
		APP.sendRenderEvent(BackgroundEvents.ProjectUpdate).then(() => null).catch(() => {
			throw new Error('Error saving project');
		});
		return id;

	}

	toObject() {
		const results: any = {};
		for (const dataKey in this.data) {
			results[dataKey] = this.getVal(dataKey as keyof ProjectAllProps);
		}
		results.logo = this.getVal('logo');
		return results;
	}

	public async statLanguages() {
		const localPath          = this.getVal<string>('path');
		const gitignoreWait      = PM_FileSystem.fileExists(path.join(localPath, '.gitignore'));
		const files              = await new PM_FileSystem([]).getFiles(localPath);
		const gitignore          = await gitignoreWait;
		const finalFiles: file[] = [];
		if (gitignore) {
			const ignorer = ignore().add((await fs.readFile(path.join(localPath, '.gitignore'))).toString());
			files.forEach((file) => {
							  if (!ignorer.ignores(path.relative(localPath, file.path))) {
								  finalFiles.push(file);
							  }
						  }
			);
		} else {
			finalFiles.push(...files);
		}
		const stats: { [key: string]: number } = {};
		for (let i = 0; i < finalFiles.length; i++) {
			const file = finalFiles[i];
			if (typeof stats[file.ext] !== 'number') {
				stats[file.ext] = 0;
			}
			stats[file.ext] += file.size;
		}
		this.setVal('stats', stats);

	}

	public async analyzeIcon() {
		const logoBaseName = this.getVal('logoBaseName');
		if (logoBaseName) {
			const logoPath = path.join(this.getVal('path'), '.project-manager', logoBaseName);
			if (await PM_FileSystem.fileExists(logoPath)) {
				return;
			}
		}
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
		if (newIcons.length > 0) {
			const logoPath = newIcons.pop()?.path;
			if (logoPath) {
				await this.setLogo(logoPath);
			} else {
				const logoBaseName = 'logo.ico';
				this.setVal('logoBaseName', logoBaseName);
				const logoPath = path.join(this.getVal('path'), '.project-manager', logoBaseName);
				const data     = await PM_FileSystem.getIconByFile(this.getVal('path'));
				await PM_FileSystem.writeFile(logoPath, data, 'base64');
				await this.setLogo(logoPath);
			}
		}
	}

	public async setLogo(logoPath: string) {
		const name   = path.basename(logoPath);
		let confPath = path.join(this.getVal('path'), '.project-manager');
		if (!await PM_FileSystem.folderExists(confPath)) {
			await fs.mkdir(confPath, { recursive: true, mode: 0o777 });
		}
		confPath = path.join(confPath, name);
		await fs.copyFile(logoPath, confPath);
		this.setVal('logoBaseName', name);
		return name;
	}

	public async removeLogo() {
		const logo   = this.getVal('logoBaseName');
		let confPath = path.join(this.getVal('path'), '.project-manager');
		confPath     = path.join(confPath, logo);
		this.setVal('logoBaseName',null)
		if (await PM_FileSystem.exists(confPath)) {
			return fs.unlink(confPath);
		}
		return false;
	}

	async delete() {
		const confPath = path.join(this.getVal('path'), '.project-manager');
		super.delete();
		await PM_FileSystem.removeFolder(confPath);
		await APP.sendRenderEvent(BackgroundEvents.ProjectUpdate);
	}
}
