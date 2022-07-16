import { shell }                from 'electron';
import { exec }                 from 'child_process';
import os                       from 'os';
import { IDEType, ProjectType } from '../../../types/project';

export class PhpStorm implements IDEType {
	public cmd: string;
	public id: number;
	public name: string;
	public path: string;

	constructor() {
		this.id   = 2;
		this.name = 'phpstorm';
		this.path = '';
		this.cmd  = '';
	}

	async isInstalled() {
		const command = 'phpstorm';
		return (new Promise((resolve) => {
			if (os.type().toLowerCase().includes('windows')) {
				exec(`where ${command}`, (error) => {
					if (error) {
						resolve(false);
						return;
					}
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('linux')) {
				exec(`which  ${command}`, (error) => {
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

	async execute(project: ProjectType) {
		return shell.openPath(`phpstorm://file/${project.path}`);
	}
}
