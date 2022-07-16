import { PathLike }    from 'fs';
import { ProjectType } from '../../../types/project';

export abstract class PluginType {
	static ispChanel = '';
	public Project: ProjectType;

	protected constructor(Project: ProjectType) {
		this.Project = Project;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static async isProject(_path: PathLike) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static async isTechnologies(_path: PathLike) {
		return false;
	}


}
