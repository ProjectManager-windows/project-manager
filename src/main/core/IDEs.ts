import Store           from 'electron-store';
import ElectronStore   from 'electron-store';
import { ipcMain }     from 'electron';
import IDEList         from '../components/IDEs';
import { Project }     from './Project';
import sendRenderEvent from '../main';
// import { t }               from './i18n';
import Stored          from './Stored';
import { IDEType }     from '../../types/project';


export class IDEs {

	static scan_index = 0;

	private static instance: IDEs;
	private store: ElectronStore;

	static getInstance() {
		if (!this.instance) {
			this.instance = new IDEs();
		}
		return this.instance;
	}

	init() {
		if (!this.store.get('IDEs')) {
			this.store.set('IDEs', {});
		}
		for (const name in IDEList) {
			const ide = IDEList[name];
			ide.isInstalled().then((isInstalled) => {
				if (isInstalled) {
					this.writeProject(Stored.toObject(ide));
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	}

	private constructor() {
		this.store = new Store();
		this.init();
		ipcMain.on('electron-ides-getAll', async (event) => {
			this.init();
			event.returnValue = this.getAll();
		});
		ipcMain.on('electron-ides-getIDE', async (event, id) => {
			this.init();
			event.returnValue = this.store.get<any, any>(`IDEs.${id}`);
		});
	}

	writeProject(_project: Project) {
		this.store.set(`IDEs.${_project.id}`, Stored.toObject(_project));
		sendRenderEvent('electron-project-update');
	}

	getAll() {
		return this.store.get<any, { [key: string]: any }>('IDEs');
	}

	getLastId(): number {
		const IDEs = this.getAll();
		const ids  = Object.keys(IDEs).map((val) => parseInt(val, 10));
		if (ids.length > 0) {
			return Math.max(...ids) + 1;
		}
		return 1;
	}

	writeProject(ide: IDEType) {
		this.store.set(`IDEs.${ide.id}`, Stored.toObject(ide));
		sendRenderEvent('electron-ides-update');
	}
}

export default IDEs.getInstance();
