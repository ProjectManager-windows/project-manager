import { readdir } from 'fs/promises';
import { Plugin }  from './Plugin';

export class GitPlugin extends Plugin {
	private static instance: GitPlugin;

	async init(): Promise<this> {
		return this;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new GitPlugin();
		}
		return this.instance;
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}

	async isProject(path: string): Promise<boolean> {
		const dirs = await readdir(path);
		return dirs.includes('.git');
	}
}
