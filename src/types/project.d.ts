import Version from './Version';

export interface IDEType {
	color: string;
	id: number;
	name: string;
	logo: string;
	path: string;
	execute: (Project: ProjectType) => void;
	isInstalled: () => Promise<boolean>;
	cmd: string;
}
export interface TerminalType {
	color: string;
	id: number;
	name: string;
	logo: string;
	path: string;
	execute: (Project: ProjectType) => void;
	isInstalled: () => Promise<boolean>;
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
	color?: string;
	id: number;
	name: string;
	description: string;
	stats?: { [key: string]: number };
	path: string; // unique identifier
	ide?: number;
	technologies?: TechnologyType[]; // TODO v0
	version?: Version; // TODO v1
	publisher?: PublisherType; // prod-deployment //TODO v1
	deployment?: PublisherType; // dev-deployment //TODO v2
}
