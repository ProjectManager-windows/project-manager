import { ipcMain } from 'electron';
import Store       from 'electron-store';


export default {
	run() {
		const store = new Store();
		if (!store.get('projects')) {
			store.set('settings', {});
		}
		ipcMain.on('electron-store-get', async (event, val) => {
			event.returnValue = store.get(val);
		});
		ipcMain.on('electron-store-set', async (_event, key, val) => {
			store.set(key, val);
		});
		ipcMain.on('electron-store-del', async (_event, key) => {
			store.delete(key);
		});
	}
};
