import { exec }     from 'child_process';
import Path         from 'path';
import { Project }  from '../../core/Projects/Project';
import { Terminal } from '../../core/Terminals/Terminal';

export class GitBash extends Terminal {

	afterInit(data: { [x: string]: any; id?: number; logo?: any; }) {
		if (!data.logo) {
			this.setVal('logo', 'icons/terminals/git.svg');
			this.setVal('color', 'transparent');
		}
		this.setVal('name', 'GitBash');
	}

	async isInstalled() {
		if (process.platform !== 'win32') {
			return false;
		}
		return (new Promise((resolve) => {
			exec(`where git`, (error, path) => {
				if (error) {
					resolve(false);
					return;
				}
				this.setVal('path', Path.dirname(Path.dirname(path.trim())));
				resolve(true);
			});
		})) as Promise<boolean>;
	}

	async execute(project: Project): Promise<void> {
		const path = Path.join(this.getVal('path'), 'git-bash.exe');
		const cmd  = `"${path}" --cd="${project.getVal('path')}"`;
		exec(cmd);
	}
}
