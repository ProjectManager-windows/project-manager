/* eslint-disable @typescript-eslint/lines-between-class-members */
import { IDEType, ProjectType, PublisherType, TechnologyType } from '../../types/project';
import Version                                                 from '../../types/Version';

export class Project implements ProjectType {
	public IDE: IDEType;
	public deployment: PublisherType;
	public id: number;
	public name: string;
	public path: string;
	public publisher: PublisherType;
	public technologies: TechnologyType[];
	public version: Version;

	constructor(data: any) {
		this.IDE          = data.IDE;
		this.deployment   = data.deployment;
		this.id           = data.id;
		this.name         = data.name;
		this.path         = data.path;
		this.publisher    = data.publisher;
		this.technologies = data.technologies;
		this.version      = data.version;
	}

	public toArray() {
		return {
			IDE         : this.IDE.toArray(),
			deployment  : this.deployment,
			id          : this.id,
			name        : this.name,
			path        : this.path,
			publisher   : this.publisher.toArray(),
			version     : this.version
		};
	}
}

