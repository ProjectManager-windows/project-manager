import search from 'libnpmsearch';

export enum hasTypes {
	 ts = "ts",
	 dt = 'dt',
	 no = 'no',
}

export interface PackageJson extends search.Result {
	_id: string;
	_nodeVersion: string;
	types?: string;
	readme?: string;
	hasTypes: hasTypes;
	dependencies?: { [key: string]: string };
	devDependencies?: { [key: string]: string };
}
