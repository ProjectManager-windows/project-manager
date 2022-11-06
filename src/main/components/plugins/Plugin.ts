import { PathLike }    from 'fs';
import { ProjectType } from '../../../types/project';
import { readdir }     from 'fs/promises';

export abstract class PluginType {
	static ispChanel = '';
	public Project: ProjectType;

	protected constructor(Project: ProjectType) {
		this.Project = Project;
	}

	static async init(){

	}

	static async isProject(path: PathLike) {
		const dirs = await readdir(path);
		return dirs.includes('.idea')||
			   dirs.includes('.vscode')||
			   dirs.includes('.project-manager')||
			   dirs.includes('composer.json')||
			   dirs.includes('package.json');
	}

	static async isTechnologies(_path: PathLike) {
		return false;
	}


}
