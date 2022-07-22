import { exec }    from 'child_process';
import os          from 'os';
import * as Path   from 'path';
import { IDE }     from '../../core/IDEs/IDE';
import { Project } from '../../core/Projects/Project';
import Logo        from '../../../../assets/icons/b64/vscode';

export class VsCode extends IDE {
	afterInit(data: { [x: string]: any; id?: number; logo?: any; }) {
		if (!data.logo) {
			this.setVal('logo', Logo);
			this.setVal('color', '#2A2A2F');
		}
		this.setVal('name', 'VsCode');
	}

	async isInstalled() {
		const command = 'code';
		return (new Promise((resolve) => {
			if (os.type().toLowerCase().includes('windows')) {
				exec(`where ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.split('\n')[0].trim()));
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('linux')) {
				exec(`which  ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.split('\n')[0].trim()));
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('darwin')) {
				exec(`which  ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.split('\n')[0].trim()));
					resolve(true);
				});
			}
		})) as Promise<boolean>;
	}

	async execute(project: Project): Promise<void> {
		exec(`code ${project.getVal('path')}`);
		// await shell.openPath(`vscode://file/${project.getVal('path')}`);
	}

}
