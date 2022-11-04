import path                   from 'path';
import { FolderFields }       from '../../../types/project';
import PM_Storage, { Tables } from '../Storage/PM_Storage';

export class Folder implements FolderFields {
	table                  = Tables.folders;
	id: number             = 0;
	name: string           = '';
	path: string           = '';
	activeWatcher: boolean = false;

	save() {
		if (!this.id) {
			this.id = PM_Storage.getNextId(this.table);
		}
		if (!this.path) {
			throw new Error('Invalid program executePath');
		}
		if (!this.name) {
			this.name = path.basename(this.path);
		}
		PM_Storage.commit<FolderFields>(this.table, this.id, {
			id           : this.id,
			name         : this.name,
			path         : this.path,
			activeWatcher: this.activeWatcher
		}, ['id', 'path']);
		return this;
	}

	setPath(path: string) {
		this.path = path;
		return this;
	}

	delete() {
		PM_Storage.delById(Tables.folders, this.id);
	}

	toggleActive(v: boolean) {
		this.activeWatcher = v;
		return this;
	}

	static fromId(id: number) {
		const data = PM_Storage.getById<FolderFields>(Tables.folders, id);
		if (!data) {
			throw new Error('Invalid program id');
		}
		const p         = new Folder();
		p.id            = id;
		p.name          = data.name;
		p.path          = data.path;
		p.activeWatcher = data.activeWatcher;
		return p;
	}
}

export default Folder;
