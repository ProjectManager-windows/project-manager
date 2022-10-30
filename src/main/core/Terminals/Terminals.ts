import { ipcMain }            from 'electron';
import Collection             from '../Storage/Collection';
import { Terminal }           from './Terminal';
import PM_Storage, { Tables } from '../Storage/PM_Storage';
import { ItemType }           from '../Storage/Item';
import cmds                   from '../../components/Terminals';
import Projects               from '../Projects/Projects';
import Settings             from '../Settings';
import { BackgroundEvents } from '../../../types/Events';

class Terminals implements Collection {
	private static instance: Terminals;
	item                             = Terminal;
	table                            = Tables.terminals;
	items: { [p: string]: Terminal } = {};

	private constructor() {
		ipcMain.on(BackgroundEvents.TerminalGetAll, async (event) => {
			event.returnValue = this.getAllRaw();
		});
		ipcMain.on(BackgroundEvents.TerminalGetProject, async (event, id) => {
			event.returnValue = this.getById(id);
		});
		ipcMain.on(BackgroundEvents.TerminalExecute, async (_event, projectId) => {
			const defaultTerminal = Number(Settings.get('defaultTerminal'));
			const project         = Projects.getById(projectId);
			let terminalsId: number;
			if (project.getVal('terminal')) {
				terminalsId = project.getVal('terminal');
			} else {
				terminalsId = defaultTerminal || 1;
			}
			const terminals    = this.getById(terminalsId);
			_event.returnValue = await terminals.execute(project);
		});
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Terminals();
		}
		return this.instance;
	}

	getAll(): { [p: string]: Terminal } {
		this.items  = {};
		const table = PM_Storage.getAll<ItemType>(this.table);
		for (const tableKey in table) {
			this.items[tableKey] = new Terminal(table[tableKey]);
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

	getById(id: number): Terminal {
		const data = PM_Storage.getById<ItemType>(this.table, id);
		if (!data) {
			throw new Error(`Terminal not found`);
		}
		// @ts-ignore
		if (data.name && cmds[data.name] !== undefined) {
			// @ts-ignore
			return new cmds[data.name](data) as Terminal;
		}
		return new Terminal(data);
	}

	getIdByName(_name: string): number {
		const terminals = this.getAll();
		// eslint-disable-next-line guard-for-in
		for (const id in terminals) {
			const terminal = terminals[id];
			if (_name === terminal.getVal('name')) {
				return parseInt(id, 10);
			}
		}
		return 0;
	}

	public async init() {
		PM_Storage.init(this.table);
		console.log('Terminals INIT');
		for (const argumentsKey in cmds) {
			// @ts-ignore
			const terminal = new cmds[argumentsKey]({}) as Terminal;
			const id       = this.getIdByName(terminal.getVal('name')) || PM_Storage.getNextId(this.table);
			if (await terminal.isInstalled()) {
				terminal.setVal('id', id);
				terminal.save();
			} else {
				terminal.setVal('id', id);
				terminal.delete();
			}
		}
	}
}

export default Terminals.getInstance();

