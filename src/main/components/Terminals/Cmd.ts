import { exec } from 'child_process';
import { Project }     from '../../core/Projects/Project';
import { Terminal }    from '../../core/Terminals/Terminal';

export class Cmd extends Terminal {

	afterInit(data: { [x: string]: any; id?: number; logo?: any; }) {
		if (!data.logo) {
			this.setVal('color', 'transparent');
		}
		this.setVal('name', 'Cmd');
	}

	async isInstalled() {
		return true;
	}

	async execute(project: Project): Promise<void> {
		exec(`start cmd.exe /K cd "${project.getVal('path')}"`);
	}
}
