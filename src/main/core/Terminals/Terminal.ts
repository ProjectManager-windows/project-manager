/* eslint-disable @typescript-eslint/lines-between-class-members */
import os          from 'os';
import { exec }    from 'child_process';
import { Item }    from '../Storage/Item';
import { Project } from '../Projects/Project';

export class Terminal extends Item {
	public table: string = 'terminals';

	init() {
		this.setVal('logo', '');
		this.setVal('name', '');
	}

	async isInstalled() {
		const command = this.getVal('command');
		if (command) {
			return (new Promise((resolve) => {
				if (os.type().toLowerCase().includes('windows')) {
					exec(`where ${command}`, (error, path) => {
						if (error) {
							resolve(false);
							return;
						}
						this.setVal('path', path);
						resolve(true);
					});
				}
				if (os.type().toLowerCase().includes('linux')) {
					exec(`which  ${command}`, (error, path) => {
						if (error) {
							resolve(false);
							return;
						}
						this.setVal('path', path);
						resolve(true);
					});
				}
				if (os.type().toLowerCase().includes('darwin')) {
					exec(`which  ${command}`, (error, path) => {
						if (error) {
							resolve(false);
							return;
						}
						this.setVal('path', path);
						resolve(true);
					});
				}
			})) as Promise<boolean>;
		}
		return true;
	}

	async execute(project: Project): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(project.getVal('path'));
	}
}
