/* eslint-disable @typescript-eslint/lines-between-class-members */
import path                                                    from 'path';
import { glob }                                                from 'glob';
import fs                                                      from 'fs/promises';
import { IDEType, ProjectType, PublisherType, TechnologyType } from '../../types/project';
import Version                                                 from '../../types/Version';
import FileSystem                                              from './FileSystem';

export class Project implements ProjectType {
	public id: number;
	public IDE: IDEType | undefined;
	public deployment: PublisherType | undefined;
	public name: string;
	public path: string;
	public publisher: PublisherType | undefined;
	public technologies: TechnologyType[] | undefined;
	public version: Version | undefined;
	public logo: string | undefined;
	public stats?: { [p: string]: number };

	constructor(data: ProjectType) {
		this.IDE          = data.IDE;
		this.deployment   = data.deployment;
		this.id           = data.id;
		this.name         = data.name;
		this.path         = data.path;
		this.publisher    = data.publisher;
		this.technologies = data.technologies;
		this.version      = data.version;
	}

	static createFromFolder(folder: string, id: number): Project {
		return Project.fromObject(
			{
				name: path.basename(folder),
				path: folder,
				id  : String(id)
			}
		);
	}

	async analyzeFolder() {
		const promises = [];
		promises.push(this.analyzeIcon());
		promises.push(this.dominantTechnologies());
		await Promise.all(promises);
		return this;
	}

	private async dominantTechnologies() {
		const files                            = await (new FileSystem).getFiles(this.path);
		const stats: { [key: string]: number } = {};
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!stats.hasOwnProperty(file.ext)) {
				stats[file.ext] = 0;
			}
			stats[file.ext] += file.size;
		}
		this.stats = stats;
	}

	private async analyzeIcon() {
		const icons: string[] = await new Promise((resolve, reject) => {
			glob('**/@(favicon.ico|favicon.jpg|favicon.png|favicon.svg|icon.png|icon.svg|icon.jpg|icon.ico|logo.ico|logo.jpg|logo.png|logo.svg)', {
				cwd     : this.path,
				silent  : true,
				nodir   : true,
				realpath: true
			}, (er, files) => {
				if (er) {
					reject(er);
					return;
				}
				resolve(files);
			});
		});
		let newIcons: {
			path: string
			size: number
			ext: string
		}[]                   = [];
		const promises: any[] = [];
		for (const iconKey in icons) {
			const icon = icons[iconKey];
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			promises.push((async () => {
				const stat = await fs.stat(icon);
				newIcons.push({
								  path: icon,
								  size: stat.size,
								  ext : path.extname(icon)
							  });
			})());
		}
		await Promise.all(promises);
		newIcons  = newIcons.sort((a, b) => {
			if (a.ext === '.svg') return Infinity;
			if (b.ext === '.svg') return Infinity;
			if (a.ext === b.ext) {
				if (a.size === b.size) return 0;
				return (a.size > b.size) ? 1 : -1;
			}
			const exts: { [key: string]: number }
						 = {
				'.ico': 1,
				'.jpg': 2,
				'.png': 4
			};
			const scoreA = (exts[a.ext] > exts[b.ext]) ? 1 : -1;
			const scoreB = scoreA * -1;
			if (a.size === b.size) return scoreA;
			return (Math.log(a.size) * scoreA > Math.log(b.size) * scoreB) ? 1 : -1;
		});
		this.logo = await Project.logoToBase64(newIcons.pop());
	}

	static toObject(project: Project) {
		return {
			name : project.name,
			path : project.path,
			id   : project.id,
			stats: project.stats,
			logo : project.logo
		};
	}

	static fromObject(data: any) {
		return new Project(
			{
				name : data.name,
				path : data.path,
				logo : data.logo,
				stats: data.stats,
				id   : parseInt(data.id, 10)
			}
		);
	}

	private static async logoToBase64(logo?: {
		path: string
		size: number
		ext: string
	}) {
		if (!logo) {
			return '';
		}
		const data = await fs.readFile(logo.path);
		switch (logo.ext) {
			case '.svg':
				return `data:image/svg+xml;base64,${data.toString('base64')}`;
			case '.jpg':
				return `data:image/jpg;base64,${data.toString('base64')}`;
			case '.png':
				return `data:image/png;base64,${data.toString('base64')}`;
			case '.ico':
				return `data:image/ico;base64,${data.toString('base64')}`;
			default:
				return '';
		}
	}
}
