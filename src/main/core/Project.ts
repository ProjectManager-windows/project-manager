/* eslint-disable @typescript-eslint/lines-between-class-members */
import path                                                    from 'path';
import { IDEType, ProjectType, PublisherType, TechnologyType } from '../../types/project';
import Version                                                 from '../../types/Version';

export class Project implements ProjectType {
	public id: number;
	public IDE: IDEType | undefined;
	public deployment: PublisherType | undefined;
	public name: string;
	public path: string;
	public publisher: PublisherType | undefined;
	public technologies: TechnologyType[] | undefined;
	public version: Version | undefined;

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
		).analyzeFolder();
	}

	analyzeFolder(){

		return this
	}

	static toObject(project: Project) {
		return {
			name: project.name,
			path: project.path,
			id  : project.id
		};
	}

	static fromObject(data: any) {
		return new Project(
			{
				name: data.name,
				path: data.path,
				id  : parseInt(data.id, 10)
			}
		);
	}
}
