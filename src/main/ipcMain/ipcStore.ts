import { ipcMain }         from 'electron';
import Store                from 'electron-store';
import { BackgroundEvents } from '../../types/Events';


export default {
	run() {
		const store = new Store();
		if (!store.get('projects')) {
			store.set('settings', {});
		}
		ipcMain.on(BackgroundEvents.StoreGet, async (event, val) => {
			event.returnValue = store.get(val);
		});
		ipcMain.on(BackgroundEvents.StoreSet, async (_event, key, val) => {
			store.set(key, val);
		});
		ipcMain.on(BackgroundEvents.StoreDel, async (_event, key) => {
			store.delete(key);
		});
	}
};
