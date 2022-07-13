import { readdir }     from 'fs/promises';
import { PluginType }  from './Plugin';
import { ProjectType } from '../../../types/project';

export class GitPlugin extends PluginType {

	static async isProject(path: string) {
		const dirs = await readdir(path);
		for (let i = 0; i < dirs.length; i++) {
			if (dirs[i].includes('.git')) {
				return true;
			}
		}
		return false;
	}

	static isTechnologies(path: string) {
		return GitPlugin.isProject(path);
	}

	public constructor(Project: ProjectType) {
		super(Project);
	}
}

export default GitPlugin;
