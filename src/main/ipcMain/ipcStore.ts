import { ipcMain }         from 'electron';
import Store               from 'electron-store';
import { BackgroundEvens } from '../../types/Enums';


export default {
	run() {
		const store = new Store();
		if (!store.get('projects')) {
			store.set('settings', {});
		}
		ipcMain.on(BackgroundEvens.StoreGet, async (event, val) => {
			event.returnValue = store.get(val);
		});
		ipcMain.on(BackgroundEvens.StoreSet, async (_event, key, val) => {
			store.set(key, val);
		});
		ipcMain.on(BackgroundEvens.StoreDel, async (_event, key) => {
			store.delete(key);
		});
	}
};
