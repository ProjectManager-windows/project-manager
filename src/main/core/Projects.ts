import Store               from 'electron-store';
import ElectronStore       from 'electron-store';
import { dialog, ipcMain } from 'electron';
import path                from 'path';
import FileSystem          from './FileSystem';
import ProgressBar         from '../components/ProgressBar/ProgressBar';
import { Project }         from './Project';
import sendRenderEvent     from '../main';
import { t }               from './i18n';
import Stored              from './Stored';

export type ProjectsScheme = {
	id: string
	name: string
	path: string
	IDE: string
	technologies: string
	version: string
	logo: string
	stats: { [key: string]: number }
}

export class Projects{

	static scan_index = 0;

	private static instance: Projects;
	private store: ElectronStore;

	static getInstance() {
		if (!this.instance) {
			this.instance = new Projects();
		}
		return this.instance;
	}

	init() {
		if (!this.store.get('projects')) {
			this.store.set('projects', {});
		}
	}

	private constructor() {
		this.store = new Store();
		this.init();
		ipcMain.on('electron-project-getAll', async (event) => {
			this.init();
			event.returnValue = this.getAll();
		});
		ipcMain.on('electron-project-getProject', async (event, id) => {
			this.init();
			event.returnValue = this.store.get<any, ProjectsScheme>(`projects.${id}`);
		});
		ipcMain.on('electron-project-scan', async (event) => {
			this.init();
			await this.scan();
			event.returnValue = 'ok';
		});
		ipcMain.on('electron-project-add', async (event) => {
			this.init();
			await this.addFolder();
			event.returnValue = 'ok';
		});
	}

	writeProject(_project: Project) {
		this.store.set(`projects.${_project.id}`, Stored.toObject(_project));
		sendRenderEvent('electron-project-update');
	}

	async scan() {
		Projects.scan_index++;
		const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		if (!folder.canceled) {
			const bar      = new ProgressBar(`scan${Projects.scan_index}`, 'scan');
			const myFs     = new FileSystem();
			const projects = await myFs.findProjects(folder.filePaths[0]);
			bar.update({
						   total  : 1,
						   current: 1,
						   message: `${t('founded')}: ${projects.length} ${t('projects')}`
					   });

			for (let i = 0; i < projects.length; i++) {
				if (await this.addFromFolder(projects[i])) {
					bar.update({
								   total  : projects.length - 1,
								   current: i,
								   message: `${t('add')}: ${path.basename(projects[i])}`
							   });
				} else {
					bar.update({
								   total  : projects.length - 1,
								   current: i,
								   message: `${path.basename(projects[i])}`
							   });
				}
			}

			return true;
		}
		return false;
	}

	async addFromFolder(folder: string) {
		if (!this.getIdByPath(folder)) {
			const p = Project.createFromFolder(folder, this.getLastId());
			await p.analyzeFolder();
			this.writeProject(p);
			return true;
		}
		const p = Stored.fromObject<Project,any>(Project,this.getProjectById(this.getIdByPath(folder)));
		await p.analyzeFolder();
		this.writeProject(p);

		return true;
	}

	async addFolder() {
		const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		if (!folder.canceled) {
			await this.addFromFolder(folder.filePaths[0]);
		}
	}

	getAll() {
		return this.store.get<any, { [key: string]: ProjectsScheme }>('projects');
	}

	getLastId(): number {
		const projects = this.getAll();
		const ids      = Object.keys(projects).map((val) => parseInt(val, 10));
		if (ids.length > 0) {
			return Math.max(...ids) + 1;
		}
		return 1;
	}

	getIdByPath(_path: string): number {
		const projects = this.getAll();
		// eslint-disable-next-line guard-for-in
		for (const id in projects) {
			const project = projects[id];
			if (_path === project.path) {
				return parseInt(id, 10);
			}
		}
		return 0;
	}

	getProjectById(id: number): ProjectsScheme {
		return this.store.get<any, ProjectsScheme>(`projects.${id}`);
	}
}

export default Projects.getInstance();
