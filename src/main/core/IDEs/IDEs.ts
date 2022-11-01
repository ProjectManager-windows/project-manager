import { ipcMain }            from 'electron';
import Collection             from '../Storage/Collection';
import { IDE }                from './IDE';
import PM_Storage, { Tables } from '../Storage/PM_Storage';
import { ItemType }           from '../Storage/Item';
import editors                from '../../components/IDEs';
import Projects               from '../Projects/Projects';
import Settings               from '../Settings';
import { BackgroundEvents }   from '../../../types/Events';
import { ProgramType }        from '../../../types/project';

class IDEs implements Collection {
	private static instance: IDEs;
	item                        = IDE;
	table                       = Tables.IDEs;
	items: { [p: string]: IDE } = {};

	private constructor() {
		ipcMain.on(BackgroundEvents.IdeGetAll, async (event) => {
			event.returnValue = this.getAllRaw();
		});
		ipcMain.on(BackgroundEvents.IdeGetProject, async (event, id) => {
			event.returnValue = this.getById(id);
		});
		ipcMain.on(BackgroundEvents.IdeExecute, async (_event, projectId) => {
			const defaultIde = Number(Settings.get('defaultIde'));
			const project    = Projects.getById(projectId);
			let ideId: number;
			if (project.getVal(ProgramType.ide)) {
				ideId = project.getVal(ProgramType.ide);
			} else {
				ideId = defaultIde || 1;
			}
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
		const data = PM_Storage.getById<ItemType>(this.table, id);
		if (!data) {
			throw new Error('ide not found');
		}
		// @ts-ignore
		if (data.name && editors[data.name] !== undefined) {
			// @ts-ignore
			return new editors[data.name](data) as IDE;
		}
		return new IDE(data);
	}

	getIdByName(_name: string): number {
		const ides = this.getAll();
		// eslint-disable-next-line guard-for-in
		for (const id in ides) {
			const ide = ides[id];
			if (_name === ide.getVal('name')) {
				return parseInt(id, 10);
			}
		}
		return 0;
	}

	public async init() {
		PM_Storage.init(this.table);
		console.log('IDE INIT');
		for (const argumentsKey in editors) {
			// @ts-ignore
			const ide = new editors[argumentsKey]({}) as IDE;
			const id  = this.getIdByName(ide.getVal('name')) || PM_Storage.getNextId(this.table);
			if (await ide.isInstalled()) {
				ide.setVal('id', id);
				ide.save();
			} else {
				ide.setVal('id', id);
				ide.delete();
			}
		}
	}
}

export default IDEs.getInstance();

