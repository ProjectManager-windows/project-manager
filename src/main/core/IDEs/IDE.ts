/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Item }    from '../Storage/Item';
import os          from 'os';
import { exec }    from 'child_process';
import { shell }   from 'electron';
import { Project } from '../Projects/Project';

export class IDE extends Item {
	public table: string = 'IDEs';

	init() {
		this.setVal('logo', '');
		this.setVal('name', '');
	}

	async isInstalled() {
		const command = 'phpstorm';
		return (new Promise((resolve) => {
			if (os.type().toLowerCase().includes('windows')) {
				exec(`where ${command}`, (error: any) => {
					if (error) {
						resolve(false);
						return;
					}
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('linux')) {
				exec(`which  ${command}`, (error: any) => {
					if (error) {
						resolve(false);
						return;
					}
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('darwin')) {
				exec(`which  ${command}`, (error) => {
					if (error) {
						resolve(false);
						return;
					}
					resolve(true);
				});
			}
		})) as Promise<boolean>;
	}

	async execute(project: Project) {
		return shell.openPath(`phpstorm://file/${project.getVal('path')}`);
	}
}
