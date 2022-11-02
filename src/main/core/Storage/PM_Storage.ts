import Store from 'electron-store';

export enum Tables {
	programs  = 'programs',
	projects  = 'projects',
	settings  = 'settings',
	empty     = '',
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

	commit<T = number | string | { [p: string]: any }>(table: Tables, id: number | string, data: T, uniqueFields: string[] = []): void {
		if (typeof data === 'number' || typeof data === 'string') {
			this.store.set(`${table}.${id}`, data);
			return;
		}
		if (uniqueFields.length > 0) {
			const data2 = data as { [p: string]: any }
			const tableData = this.getAll<T>(table) as { [p: string]: { [p: string]: any } };
			const isUnique  = uniqueFields.every((field: string) => {
				return !Object.entries(tableData).some(([_id, item]) => {
					if (parseInt(<string>id, 10) === parseInt(_id, 10)) return false;
					return item[field] === data2[field];
				});
			});
			if (!isUnique) {
				throw new Error('is not unique');
			}
		}
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
