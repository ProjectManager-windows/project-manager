import * as fs from 'node:fs/promises';
import path    from 'node:path';

type ProgressCallback = (path: string, founded: boolean) => any

class FileSystem {
	blacklist = [
		'$Recycle.Bin',
		'$WinREAgent',
		'System Volume Information',
		'Windows',
		'root'
	];

	async getDirectories(source: string) {
		const dirs: string[] = [];
		return fs.readdir(source, { withFileTypes: true }).then(async (items) => {
			for (const p of items) {
				try {
					if (p.isDirectory()) {
						const PathName = path.join(source, p.name);
						dirs.push(PathName);
						dirs.push(...await this.getDirectories(PathName));
					}

					// eslint-disable-next-line no-empty
				} catch (e) {

				}

			}
			return dirs;
		});


	}

	async findProjects(startPath = '', progress: ProgressCallback = () => {
	}) {
		const projects: string[] = [];
		const dirs               = await this.getDirectories(startPath);
		dirs.map(async (elem) => {
			let founded = false;
			if (await this.isProject(elem)) {
				projects.push(elem);
				founded = true;
			}
			progress.call('findProjects', elem, founded);
		});
		return projects;
	}

	async isProject(item: string) {
		const stat = await fs.stat(item);
		if (stat.isFile()) {
			return false;
		}
		return fs.readdir(item).then((items) => {
			for (const p of items) {
				const name = path.basename(p);
				if (['.git', '.idea', '.vscode'].indexOf(name) >= 0) {
					return true;
				}
			}
			return false;
		}).catch(() => {
			return false;
		});
	}
}

export default FileSystem;
