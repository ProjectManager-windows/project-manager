import Store from 'electron-store';

export enum Tables {
	programs = 'programs',
	terminals= 'terminals',
	projects = 'projects',
	settings = 'settings',
	IDEs     = 'IDEs',
	empty    = '',
}

class PM_Storage {
	private static instance: PM_Storage;
	private store: Store;

	private constructor() {
		this.store = new Store();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new PM_Storage();
		}
		return this.instance;
	}

	commit<T = number | string | { [p: string]: any }>(table: Tables, id: number | string, data: T): void {
		this.store.set(`${table}.${id}`, data);
	}

	getAll<T = number | string | { [p: string]: any }>(table: Tables): { [p: string]: T } | undefined {
		return this.store.get(table) as { [p: string]: T } | undefined;
	}

	init(table: Tables) {
		const projects = this.getAll(table);
		if (!projects) {
			this.store.set(table, {});
		}
	}

	getById<T = number | string | { [p: string]: any }>(table: Tables, id: number | string): T | undefined {
		return this.store.get(`${table}.${id}`) as T | undefined;
	}

	delAll(table: Tables): void {
		this.store.delete(`${table}`);
	}

	delById(table: Tables, id: number | string): void {
		this.store.delete(`${table}.${id}`);
	}

	clear() {
		alert('DANGER');
		this.store.clear();
	}

	getNextId(table: Tables): number {
		const projects = this.getAll(table);
		if (projects) {
			const ids = Object.keys(projects).map((val) => parseInt(val, 10));
			if (ids.length > 0) {
				return Math.max(...ids) + 1;
			}
		}
		return 1;
	}
}

export default PM_Storage.getInstance();
