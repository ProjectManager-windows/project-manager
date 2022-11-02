import { dialog, ipcMain, shell } from 'electron';
import path                       from 'path';
import fs                         from 'fs/promises';
import Collection                 from '../Storage/Collection';
import { Project }                from './Project';
import PM_Storage, { Tables }     from '../Storage/PM_Storage';
import { ItemType }               from '../Storage/Item';
import ProgressBar                from '../ProgressBar/ProgressBar';
import PM_FileSystem              from '../Utils/PM_FileSystem';
import { t }                      from '../Utils/i18n';
import { BackgroundEvents }       from '../../../types/Events';

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
	table                           = Tables.projects;
	items: { [p: string]: Project } = {};

	private constructor() {
		ipcMain.on(BackgroundEvents.ProjectGetAll, async (event) => {
			this.init();
			event.returnValue = this.getAllRaw();
		});
		ipcMain.on(BackgroundEvents.ProjectGetProject, async (event, id) => {
			this.init();
			event.returnValue = this.getById(id);
		});
		ipcMain.on(BackgroundEvents.ProjectScan, async (event) => {
			this.init();
			await this.scan();
			event.returnValue = 'ok';
		});
		ipcMain.on(BackgroundEvents.ProjectAdd, async (event) => {
			this.init();
			await this.addFolder();
			event.returnValue = 'ok';
		});
		ipcMain.on(BackgroundEvents.ProjectSet, async (_event, id, key, value) => {
			const p = this.getById(id);
			p.setVal(key, value);
			p.save();
		});
		ipcMain.on(BackgroundEvents.ProjectOpenFolder, async (_event, id) => {
			const p    = this.getById(id);
			const path = p.getVal('path');
			await shell.openPath(path);
		});
		ipcMain.on(BackgroundEvents.ProjectChangeLogo, async (_event, id: number) => {
			const p = this.getById(id);

			const file = await dialog.showOpenDialog(
				{
					defaultPath: p.getVal('path'),
					properties : ['openFile'],
					filters    : [
						{
							name      : '',
							extensions: ['svg', 'jpg', 'jpeg', 'png', 'ico', 'gif', 'webp', 'base64', 'b64']
						}]
				});
			if (!file.canceled) {
				const logo = file.filePaths[0];
				await p.setLogo(logo);
				p.save();
			}
		});
		ipcMain.on(BackgroundEvents.ProjectRemoveLogo, async (_event, id: number) => {
			const p = this.getById(id);
			if (p) {
				await p.removeLogo();
				p.save();
			}
		});

		ipcMain.on(BackgroundEvents.ProjectRemove, async (_event, id) => {
			const p = this.getById(id);
			await p.delete();
		});
		ipcMain.on(BackgroundEvents.ProjectDelete, async (_event, id) => {
			const p = this.getById(id);
			// const path = p.getVal('path');
			// await trash(path, { glob: false });
			await p.delete();
		});
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Projects();
		}
		return this.instance;
	}

	getAll(): { [p: string]: Project } {
		this.items = {};
		const data = PM_Storage.getAll<ItemType>(this.table);
		for (const tableKey in data) {
			const key = parseInt(tableKey, 10);
			if (data[key]) {
				if (data[key].id > 0) {
					this.items[tableKey] = new Project(data[key]);
				} else {
					PM_Storage.delById(this.table, key);
				}
			}
		}
		return this.items;
	}

	getAllRaw(): { [p: string]: any } {
		const items: any = {};
		const data       = this.getAll();
		for (const tableKey in data) {
			const key  = parseInt(tableKey, 10);
			items[key] = data[key].toObject();
		}
		return items;
	}

	getById(id: number): Project {
		const p = PM_Storage.getById<ItemType>(this.table, id);
		if (!p) {
			throw new Error('Project not found');
		}
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
								   message: `${t('update')}: ${path.basename(projects[i])}`
							   });
				}
			}

			return true;
		}
		return false;
	}

	async addFromFolder(folder: string) {
		await this.generateConfigFolder(folder);
		const id = this.getIdByPath(folder);
		if (!id) {
			const p = new Project(
				{
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
		return false;
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
		if (!await PM_FileSystem.folderExists(configFolder)) {
			await fs.mkdir(configFolder, { recursive: true, mode: 0o777 });
		}
		const gitIgnore = path.join(folder, '.gitignore');
		if (await PM_FileSystem.fileExists(gitIgnore)) {
			let content = (await fs.readFile(gitIgnore)).toString();
			if (!content.includes('.project-manager')) {
				content += '\n.project-manager/';
			}
			await fs.writeFile(gitIgnore, content, 'utf8');
		}
		if (!await PM_FileSystem.fileExists(configFolder)) {
			await fs.mkdir(configFolder, { recursive: true, mode: 0o777 });
		}
		// hidefile.hideSync(configFolder);
		const configFile = path.join(configFolder, 'config.json');
		if (!await PM_FileSystem.fileExists(configFile)) {
			await fs.writeFile(configFile, '{}', { encoding: 'utf8', mode: 0o777 });
		}
	}
}

export default Projects.getInstance();

