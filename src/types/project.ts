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

export type ProjectType = ProjectAllProps & {
	logo?: string;
	color?: string;
	id: number;
	name: string;
	description: string;
	stats?: { [key: string]: number };
	path: string; // unique identifier
	ide?: number;
	terminal?: number;
	technologies?: TechnologyType[]; // TODO v0
	version?: Version; // TODO v1
	publisher?: PublisherType; // prod-deployment //TODO v1
	deployment?: PublisherType; // dev-deployment //TODO v2
}

export enum ProgramType {
	ide        = 'ide',
	terminal   = 'terminal',
	webBrowser = 'webBrowser',
	explorer   = 'explorer',
	other      = 'other',
}

export interface FolderFields {
	id: number;
	name: string;
	path: string;
	activeWatcher: boolean;
}

export interface ProgramFields {
	id: number;
	executePath: string;
	executeCommand: string;
	name: string;
	label: string;
	logo: string;
	color: string;
	type: ProgramType;
}

export type ProgramFieldsKeys = keyof ProgramFields

export type ProgramCommandVars = {
	[p: `PROJECT_${string}` | `PROGRAM_${string}` | keyof typeof process.env]: string | number | { [k: string]: any } | undefined
}

export interface ProjectProps {
	path?: string;
	size?: number;
	compressedSize?: number;
	stats?: { [key: string]: number };
	plugins?: { [key: string]:boolean}
}

export interface ProjectExternalProps {
	ide: string;
	terminal: string;
	name: string;
	logo: string;
	logoBaseName: string;
	color: string;
	description: string;
	env: string;
}

export type ProjectAllProps = ProjectProps & ProjectExternalProps;
