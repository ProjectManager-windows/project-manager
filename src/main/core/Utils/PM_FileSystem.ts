import * as fs  from 'node:fs/promises';
import * as fss from 'node:fs';
import path     from 'node:path';
import plugins  from '../../components/plugins';

export type file = {
	path: string,
	name: string,
	size: number,
	ext: string,
}

class PM_FileSystem {
	blacklist = [
		'$Recycle.Bin',
		'$WinREAgent',
		'System Volume Information',
		'Windows',
		'root',
		'node_modules',
		'vendor'
	];

	constructor(blacklist?: string[]) {
		this.blacklist = blacklist ?? this.blacklist;
		// const store = new Store();
		// const a     = store.get('settings.fs.blacklist') as any;
		// if (typeof a === 'string') {
		// 	this.blacklist = a.split('\uE000');
		// }
	}

	static async fileExists(src: string): Promise<boolean> {
		return fs.stat(src).then((stat) => stat.isFile()).catch(() => false);
	}

	static async folderExists(src: string): Promise<boolean> {
		return fs.stat(src).then((stat) => stat.isDirectory()).catch(() => false);
	}

	static async exists(src: string): Promise<boolean> {
		return fs.stat(src).then(() => true).catch(() => false);
	}

	async getDirectories(src: string, dirs: string[] = []): Promise<string[]> {
		return fs
			.readdir(src, { withFileTypes: true })
			.then(async (items) => {
				const promises = [];
				for (let x = 0; x < items.length; x++) {
					const item = items[x];
					if (this.blacklist.includes(item.name)) {
						continue;
					}
					try {
						if (item.isDirectory()) {
							const PathName = path.join(src, item.name);
							dirs.push(PathName);
							if (!item.name.startsWith('.')) {
								promises.push(this.getDirectories(PathName, dirs));
							}
						}
					} catch (e) {
					}
				}
				await Promise.all(promises);
				return dirs;
			})
			.catch(() => []);
	}

	async getFiles(src: string, files: file[] = []): Promise<file[]> {
		return fs
			.readdir(src, { withFileTypes: true })
			.then(async (items) => {
				const promises = [];
				for (let x = 0; x < items.length; x++) {
					const item = items[x];
					if (this.blacklist.includes(item.name)) {
						continue;
					}
					try {
						const PathName = path.join(src, item.name);
						if (item.isDirectory()) {
							if (!item.name.startsWith('.')) {
								promises.push(this.getFiles(PathName, files));
							}
						} else if (item.isFile()) {
							promises.push((async () => {
								const data = await fs.stat(PathName);
								files.push({
											   'path': PathName,
											   'name': item.name,
											   'size': data.size,
											   'ext' : path.extname(PathName)
										   });
							})());
						}
					} catch (e) {
					}
				}
				await Promise.all(promises);
				return files;
			})
			.catch((e) => {
				console.error(e);
				return [];
			});
	}

	async findProjects(src: string, projects: string[] = []): Promise<string[]> {
		return fs
			.readdir(src, { withFileTypes: true })
			.then(async (items) => {
				const promises = [];
				for (let x = 0; x < items.length; x++) {
					const item = items[x];
					if (this.blacklist.includes(item.name)) {
						continue;
					}
					try {
						if (item.isDirectory()) {
							const PathName = path.join(src, item.name);
							if (!item.name.startsWith('.')) {
								if (await this.isProject(PathName)) {
									projects.push(PathName);
								} else {
									promises.push(this.findProjects(PathName, projects));
								}
							}
						}
					} catch (e) {
					}
				}
				await Promise.all(promises);
				return projects;
			})
			.catch(() => []);
	}


	async isProject(item: string) {
		const stat = await fs.stat(item);
		if (stat.isFile()) {
			return false;
		}
		// eslint-disable-next-line guard-for-in
		for (const plugin in plugins) {
			try {
				if (await plugins[plugin].isProject(item)) {
					return true;
				}
			} catch (e) {

			}
		}
		return false;
	}

	static logoToBase64(logo: string) {
		if (!logo) {
			return '';
		}
		const ext  = path.extname(logo);
		const data = fss.readFileSync(logo);
		switch (ext.toLowerCase()) {
			case '.svg':
				return `data:image/svg+xml;base64,${data.toString('base64')}`;
			case '.jpg':
			case '.jpeg':
				return `data:image/jpg;base64,${data.toString('base64')}`;
			case '.png':
				return `data:image/png;base64,${data.toString('base64')}`;
			case '.ico':
				return `data:image/ico;base64,${data.toString('base64')}`;
			case '.gif':
				return `data:image/gif;base64,${data.toString('base64')}`;
			case '.webp':
				return `data:image/gif;base64,${data.toString('base64')}`;
			case '.base64':
			case '.b64':
				return data.toString();
			default:
				return '';
		}
	}
}

export default PM_FileSystem;


