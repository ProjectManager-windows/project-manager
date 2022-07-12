import Store               from 'electron-store';
import ElectronStore       from 'electron-store';
import { dialog, ipcMain } from 'electron';
import FileSystem          from './FileSystem';
import ProgressBar         from '../components/ProgressBar/ProgressBar';

export class Projects {
	private static instance: Projects;
	private store: ElectronStore;

	static getInstance() {
		if (!this.instance) {
			this.instance = new Projects();
		}
		return this.instance;
	}

	private constructor() {
		this.store = new Store();
		ipcMain.on('electron-project-getAll', async (event) => {
			event.returnValue = this.store.get('projects');
		});
		ipcMain.on('electron-project-getProject', async (event, id) => {
			event.returnValue = this.store.get('projects.' + id);
		});
		ipcMain.on('electron-project-scan', async (event) => {
			await this.scan();
			event.returnValue = 'ok';
		});
		ipcMain.on('electron-project-add', async (event) => {
			await this.addFromFolder();
			event.returnValue = 'ok';
		});
	}

	async scan() {
		const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		if (!folder.canceled) {
			const bar      = new ProgressBar('scan', 'scan');
			const myFs     = new FileSystem();
			const projects = await myFs.findProjects(folder.filePaths[0]);
			bar.update({
						   total  : 1,
						   current: 1,
						   message: `Найдено ` + projects.length + ' проэктов'
					   });
		}
		console.log();
	}

	async addFromFolder() {
		await dialog.showOpenDialog({ properties: ['openDirectory'] });
	}
}

export default Projects.getInstance();
