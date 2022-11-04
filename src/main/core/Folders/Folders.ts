import PM_Storage, { Tables } from '../Storage/PM_Storage';
import { dialog, ipcMain }    from 'electron';
import { BackgroundEvents }   from '../../../types/Events';
import { FolderFields }       from '../../../types/project';
import Folder                 from './Folder';
import APP                    from '../../main';

class Folders {
	table: string = Tables.folders;
	private static instance: Folders;

	constructor() {
		ipcMain.on(BackgroundEvents.FoldersGetAll, (event) => {
			event.returnValue = this.getAll() ?? {};
		});
		ipcMain.on(BackgroundEvents.FolderAdd, async (_event) => {
			const folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
			if (!folder.canceled) {
				const path = folder.filePaths[0];
				(new Folder()).setPath(path).save();
				setTimeout(() => {
					APP.sendRenderEvent(BackgroundEvents.FolderUpdate);
				}, 200);
			}
		});
		ipcMain.on(BackgroundEvents.FoldersDelete, (_event, ids: number[]) => {
			ids.forEach(id => {
				Folder.fromId(id).delete();
			});
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.FolderUpdate);
			}, 200);
		});
		ipcMain.on(BackgroundEvents.FolderToggle, (_event, data: { id: number, value: boolean }) => {
			const { id, value } = data;
			Folder.fromId(id).toggleActive(value).save();
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.FolderUpdate);
			}, 200);
		});
	}

	public async init() {
		PM_Storage.init(Tables.folders);
		console.log('folders INIT');
	}

	getAll(): { [p: string]: FolderFields } | undefined {
		return PM_Storage.getAll<FolderFields>(Tables.folders);
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Folders();
		}
		return this.instance;
	}

}

export default Folders.getInstance();
