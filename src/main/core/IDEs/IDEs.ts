import Collection   from '../Storage/Collection';
import { IDE }      from './IDE';
import PM_Storage   from '../Storage/PM_Storage';
import { ItemType } from '../Storage/Item';
import { ipcMain }  from 'electron';
import editors      from '../../components/IDEs';
import Projects     from '../Projects/Projects';
import Settings     from '../Settings';

class IDEs implements Collection {
	private static instance: IDEs;
	item                        = IDE;
	table                       = 'IDEs';
	items: { [p: string]: IDE } = {};

	private constructor() {
		ipcMain.on('electron-ide-getAll', async (event) => {
			this.init();
			event.returnValue = this.getAllRaw();
		});
		ipcMain.on('electron-ide-getProject', async (event, id) => {
			this.init();
			event.returnValue = this.getById(id);
		});
		ipcMain.on('electron-ide-execute', async (_event, projectId) => {
			const defaultIde   = Settings.get('defaultIde');
			const project      = Projects.getById(projectId);
			const ideId        = project.getVal('ide') || defaultIde;
			const ide          = this.getById(ideId);
			_event.returnValue = await ide.execute(project);
		});
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new IDEs();
		}
		return this.instance;
	}

	getAll(): { [p: string]: IDE } {
		this.items  = {};
		const table = PM_Storage.getAll<ItemType>(this.table);
		for (const tableKey in table) {
			this.items[tableKey] = new IDE(table[tableKey]);
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

	getById(id: number): IDE {
		return new IDE(PM_Storage.getById<ItemType>(this.table, id));
	}

	getIdByName(_name: string): number {
		const projects = this.getAll();
		// eslint-disable-next-line guard-for-in
		for (const id in projects) {
			const project = projects[id];
			if (_name === project.getVal('name')) {
				return parseInt(id, 10);
			}
		}
		return 0;
	}

	public async init() {
		for (const argumentsKey in editors) {
			// @ts-ignore
			const ide = new editors[argumentsKey]({}) as IDE;
			const id  = this.getIdByName(ide.getVal('name'));
			if (await ide.isInstalled()) {
				ide.setVal('id', id);
				ide.save();
			} else {
				ide.setVal('id', id);
				ide.delete();
			}
		}
		PM_Storage.init(this.table);
	}
}

export default IDEs.getInstance();

