import { exec }    from 'child_process';
import os          from 'os';
import * as Path   from 'path';
import { IDE }     from '../../core/IDEs/IDE';
import { Project } from '../../core/Projects/Project';

export class PhpStorm extends IDE {

	afterInit(data: { [x: string]: any; id?: number; logo?: any; }) {
		if (!data.logo) {
			let p = `file://${Path.join(__dirname,'..','..','..', '..', 'assets','icons','ides','phpstorm.svg')}`
			p =p.replaceAll("\\",'/')
			console.log(p)
			this.setVal('logo', p);
			this.setVal('color', 'transparent');
		}
		this.setVal('name', 'PhpStorm');
	}

	async isInstalled() {
		const command = 'phpstorm';
		return (new Promise((resolve) => {
			if (os.type().toLowerCase().includes('windows')) {
				exec(`where ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.trim()));
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('linux')) {
				exec(`which  ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.trim()));
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('darwin')) {
				exec(`which  ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.trim()));
					resolve(true);
				});
			}
		})) as Promise<boolean>;
	}

	async execute(project: Project): Promise<void> {
		exec(`phpstorm ${project.getVal('path')}`);
	}
}
