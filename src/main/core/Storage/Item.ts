import PM_Storage, { Tables } from './PM_Storage';

export type ItemType = {
	id: number
	[p: string]: any
}

export abstract class Item {
	public data: ItemType = { id: 0 };
	public table: Tables  = Tables.empty;

	public constructor(data: ItemType) {
		this.init(data);
		this.data = data;
		this.afterInit(data);
	}

	abstract init(data: ItemType): void

	afterInit(_data: ItemType): void{}

	setVal<T = any>(key: string, value: T) {
		this.data[key] = value;
	}

	getVal<T = any>(key: string): T {
		return this.data[key];
	}

	save(): number {
		if (!this.getVal<number>('id')) {
			this.setVal<number>('id', PM_Storage.getNextId(this.table));
		}
		PM_Storage.commit<ItemType>(this.table, this.getVal<number>('id'), this.data);
		return parseInt(this.getVal('id'), 10);
	}

	delete() {
		if (this.getVal<number>('id')) {
			PM_Storage.delById(this.table, this.getVal<number>('id'));
			this.data = { id: 0 };
		}
	}
}
