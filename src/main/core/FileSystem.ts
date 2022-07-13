import * as fs from 'node:fs/promises';
import path    from 'node:path';
import Store   from 'electron-store';
import plugins from '../components/plugins';


class FileSystem {
	blacklist = [
		'$Recycle.Bin',
		'$WinREAgent',
		'System Volume Information',
		'Windows',
		'root',
		'node_modules',
		'vendor'
	];

	constructor() {
		const store = new Store();
		const a     = store.get('settings.fs.blacklist') as any;
		if (typeof a === 'string') {
			this.blacklist = a.split('\uE000');
		}
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
}

export default FileSystem;
