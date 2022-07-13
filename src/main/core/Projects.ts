import Store               from 'electron-store';
import ElectronStore       from 'electron-store';
import { dialog, ipcMain } from 'electron';
import FileSystem          from './FileSystem';
import ProgressBar         from '../components/ProgressBar/ProgressBar';
import path                from 'path';
import { Project }         from './Project';

type ProjectsScheme = {
	id: string
	name: string
	path: string
	IDE: string
	technologies: string
	version: string
}

export class Projects {

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
			event.returnValue = this.store.get('projects');
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
		this.store.set(`projects.${_project.id}`, Project.toObject(_project));
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
						   message: `Найдено ${projects.length} проектов`
					   });

			for (let i = 0; i < projects.length; i++) {
				await this.addFromFolder(projects[i]);
				bar.update({
							   total  : projects.length - 1,
							   current: i,
							   message: `Добавляю ${path.basename(projects[i])}`
						   });
			}
			return true;
		}
		return false;
	}

	async addFromFolder(folder: string) {
		if (!this.getIdByPath(folder)) {
			const p = Project.createFromFolder(folder, this.getLastId());
			this.writeProject(p);
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

	getIdByPath(_path: string) {
		const projects = this.getAll();
		// eslint-disable-next-line guard-for-in
		for (const id in projects) {
			const project = projects[id];
			if (_path === project.path) {
				return project;
			}
		}
		return false;
	}

	async addFolder() {
		const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		if (!folder.canceled) {
			await this.addFromFolder(folder.filePaths[0]);
		}
	}
}

export default Projects.getInstance();
