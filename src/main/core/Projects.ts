import Store               from 'electron-store';
import ElectronStore       from 'electron-store';
import { dialog, ipcMain } from 'electron';

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
		ipcMain.on('electron-project-add', async (_event, key) => {
			this.store.delete(key);
		});
	}

	async scan() {
		await dialog.showOpenDialog({ properties: ['openDirectory'] });
	}
}

export default Projects.getInstance();
