import { IDEType, ProjectType } from '../../../types/project';

export class vsCode implements IDEType {
	public cmd: string;
	public id: number;
	public name: string;
	public path: string;

	isInstalled(){
		return true;
	};

	execute(_Project: ProjectType): void {

	}

	constructor(data: IDEType) {
		this.id   = data.id;
		this.name = data.name;
		this.path = data.path;
		this.cmd  = data.cmd;
	}

}
