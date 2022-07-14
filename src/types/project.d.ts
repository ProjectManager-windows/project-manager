import Version from './Version';

export interface IDEType {
	id: number;
	name: string;
	path: string;
	execute: (Project: ProjectType) => void;
	cmd: string;
}

export interface TechnologyType {
	id: number;
	name: string;
	element: string; // jsx element
	data: any;
	root: string;
}

export interface PublisherType extends TechnologyType {
	publish: (Project: ProjectType) => void;
}

export interface ProjectType {
	logo?: string;
	id: number;
	name: string;
	stats?: { [key: string]: number };
	path: string; // unique identifier
	IDE?: IDEType;
	technologies?: TechnologyType[]; // TODO v0
	version?: Version; // TODO v1
	publisher?: PublisherType; // prod-deployment //TODO v1
	deployment?: PublisherType; // dev-deployment //TODO v2
}
