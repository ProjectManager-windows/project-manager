import Collection          from '../Storage/Collection';
import { Project }         from './Project';
import PM_Storage          from '../Storage/PM_Storage';
import { ItemType }        from '../Storage/Item';
import { dialog, ipcMain } from 'electron';
import ProgressBar         from '../ProgressBar/ProgressBar';
import path                from 'path';
import PM_FileSystem       from '../Utils/PM_FileSystem';
import { t }               from '../Utils/i18n';
import fs                  from 'fs/promises';

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
	item                            = Project;
	table                           = 'projects';
	items: { [p: string]: Project } = {};

	private constructor() {
		ipcMain.on('electron-project-getAll', async (event) => {
			this.init();
			event.returnValue = this.getAllRaw()
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
		ipcMain.on('electron-project-set', async (_event, id, key, value) => {
			const p = this.getById(id);
			p.setVal(key, value);
			p.save();
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
		const data       = this.getAll();
		for (const tableKey in data) {
			items[tableKey] = data[tableKey].toObject()
		}
		return items;
	}

	getById(id: number): Project {
		const p = PM_Storage.getById<ItemType>(this.table, id)
		return new Project(p);
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
		await this.generateConfigFolder(folder);
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

	async generateConfigFolder(folder: string) {
		const configFolder = path.join(folder, '.project-manager');
		try {
			await fs.stat(configFolder);
		} catch (e) {
			await fs.mkdir(configFolder, { recursive: true, mode: 0o777 });
		}
		const configFile = path.join(folder, '.project-manager', 'config.json');
		try {
			await fs.stat(configFile);
		} catch (e) {
			await fs.writeFile(configFile, '{}', { encoding: 'utf8', mode: 0o777 });
		}
	}
}

export default Projects.getInstance();

