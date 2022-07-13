import { readdir }     from 'fs/promises';
import { PluginType }  from './Plugin';
import { ProjectType } from '../../../types/project';

export class GitPlugin extends PluginType {

	static PluginName: string = 'git';

	static async isProject(path: string) {
		const dirs = await readdir(path);
		return dirs.includes('.git');
	}

	static isTechnologies(path: string) {
		return GitPlugin.isProject(path);
	}

	public constructor(Project: ProjectType) {
		super(Project);
	}
}

export default GitPlugin;
