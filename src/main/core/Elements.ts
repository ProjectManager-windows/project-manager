/* eslint-disable @typescript-eslint/lines-between-class-members */
import { IDEType, ProjectType, PublisherType, TechnologyType } from '../../types/project';
import Version                                                 from '../../types/Version';

export class Project implements ProjectType {
	public id: number;
	public IDE: IDEType;
	public deployment: PublisherType;
	public name: string;
	public path: string;
	public publisher: PublisherType;
	public technologies: TechnologyType[];
	public version: Version;

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
}
