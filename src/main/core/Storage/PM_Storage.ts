import Store from 'electron-store';

export class PM_Storage {
	private static instance: PM_Storage;
	private store: Store;

	static getInstance() {
		if (!this.instance) {
			this.instance = new PM_Storage();
		}
		return this.instance;
	}

	private constructor() {
		this.store = new Store();
	}

	commit<T = number | string | { [p: string]: any }>(table: string, id: number, data: T): void {
		this.store.set(`${table}.${id}`, data);
	}

	getAll<T = number | string | { [p: string]: any }>(table: string): { [p: string]: T } {
		return this.store.get(table) as { [p: string]: T };
	}

	init(table: string) {
		const projects = this.getAll(table);
		if (!projects) {
			this.store.set(table, {});
		}
	}

	getById<T = number | string | { [p: string]: any }>(table: string, id: number): T {
		return this.store.get(`${table}.${id}`) as T;
	}

	delAll(table: string): void {
		this.store.delete(`${table}`);
	}

	delById(table: string, id: number): void {
		this.store.delete(`${table}.${id}`);
	}

	clear() {
		alert('DANGER');
		this.store.clear();
	}

	getNextId(table: string): number {
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
