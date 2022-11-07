import { ProjectType } from '../../../types/project';
import { PathLike }    from 'fs';
import { readdir }     from 'fs/promises';
import projects        from '../../core/Projects/Projects';
import plugins         from './index';

export abstract class Plugin {
	public static PluginName: string;
	public Project?: ProjectType;

	setProject(Project: ProjectType) {
		this.Project = Project;
	}

	abstract isProject(path: string): Promise<boolean>

	abstract isAvailable(): Promise<boolean>
}

export async function isProject(path: PathLike) {
	const dirs = await readdir(path);
	return dirs.includes('.idea')||
		   dirs.includes('.vscode')||
		   dirs.includes('.project-manager')||
		   dirs.includes('composer.json')||
		   dirs.includes('package.json');
}

export async function checkProject(name:string,projectId:number){
	const p = projects.getById(projectId);
	if (!p) {
		throw new Error(`No project`);
	}
	const result = !!plugins.find(p => p.name === name)?.getInstance().isProject(p.getVal('path'));
	if (result) {
		const plugins = p.getVal('plugins') || {};
		plugins[name] = result;
		p.setVal('plugins', plugins);
	}
	return result;
}
export async function checkAvailable(name:string){
	return !!plugins.find(p => p.name === name)?.getInstance().isAvailable();
}
