import { Item } from './Item';

export interface Collection {
	item: typeof Item;
	table: string;

	getAll(): { [p: string]: Item };

	getById(id: number): Item;

}

export default Collection;
