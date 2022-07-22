import { exec }     from 'child_process';
import { Project }  from '../../core/Projects/Project';
import { Terminal } from '../../core/Terminals/Terminal';
import Logo         from '../../../../assets/icons/b64/cmd';

export class Cmd extends Terminal {

	afterInit(data: { [x: string]: any; id?: number; logo?: any; }) {
		if (!data.logo) {
			this.setVal('logo', Logo);
			this.setVal('color', 'transparent');
		}
		this.setVal('name', 'Cmd');
	}

	async isInstalled() {
		return process.platform === 'win32';
	}

	async execute(project: Project): Promise<void> {
		exec(`start cmd.exe /K cd "${project.getVal('path')}"`);
	}
}
