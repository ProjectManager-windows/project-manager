import Collection          from '../Storage/Collection';
import { Project }         from './Project';
import PM_Storage          from '../Storage/PM_Storage';
import { ItemType }        from '../Storage/Item';
import { dialog, ipcMain } from 'electron';
import ProgressBar         from '../ProgressBar/ProgressBar';
import path                from 'path';
import PM_FileSystem       from '../Utils/PM_FileSystem';
import { t }               from '../Utils/i18n';

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

class Projects implements Collection {
	private static instance: Projects;
	private static scan_index: number;
	item  = Project;
	table = 'projects';
	items: { [p: string]: Project } = {};

	private constructor() {
		ipcMain.on('electron-project-getAll', async (event) => {
			this.init();
			event.returnValue = this.getAllRaw();
		});
		ipcMain.on('electron-project-getProject', async (event, id) => {
			this.init();
			event.returnValue = this.getById(id);
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

	static getInstance() {
		if (!this.instance) {
			this.instance = new Projects();
		}
		return this.instance;
	}

	getAll(): { [p: string]: Project } {
		this.items  = {};
		const table = PM_Storage.getAll<ItemType>(this.table);
		for (const tableKey in table) {
			this.items[tableKey] = new Project(table[tableKey]);
		}
		return this.items;
	}

	getAllRaw(): { [p: string]: any } {
		const items: any = {};
		const data       = PM_Storage.getAll<ItemType>(this.table);
		for (const tableKey in data) {
			items[tableKey] = data[tableKey];
		}
		return items;
	}

	getById(id: number): Project {
		return new Project(PM_Storage.getById<ItemType>(this.table, id));
	}

	async scan() {
		Projects.scan_index++;
		const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		if (!folder.canceled) {
			const bar      = new ProgressBar(`scan${Projects.scan_index}`, 'scan');
			const myFs     = new PM_FileSystem();
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
		const id = this.getIdByPath(folder);
		if (!id) {
			const p = new Project({
									  id  : 0,
									  path: folder,
									  name: path.basename(folder)
								  });
			await p.analyzeFolder();
			p.save();
			return true;
		}
		const p = this.getById(id);
		await p.analyzeFolder();
		p.save();
		return true;
	}

	async addFolder() {
		const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		if (!folder.canceled) {
			await this.addFromFolder(folder.filePaths[0]);
		}
	}

	getIdByPath(_path: string): number {
		const projects = this.getAll();
		// eslint-disable-next-line guard-for-in
		for (const id in projects) {
			const project = projects[id];
			if (_path === project.getVal('path')) {
				return parseInt(id, 10);
			}
		}
		return 0;
	}

	public init() {
		PM_Storage.init(this.table);
	}
}

export default Projects.getInstance();

