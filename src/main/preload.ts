import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'electron-progressbar-update' | 'test';

export const bridge = {
	ipcRenderer: {
		sendMessage(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: Channels, func: (...args: any[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => ipcRenderer.removeListener(channel, subscription);
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
		selectFolder() {
			return ipcRenderer.sendSync('electron-selectFolder');
		}
	},
	store      : {
		get(property: string) {
			return ipcRenderer.sendSync('electron-store-get', property);
		},
		set(property: string, val: any) {
			ipcRenderer.send('electron-store-set', property, val);
		},
		del(property: string) {
			ipcRenderer.send('electron-store-del', property);
		}
		// Other method you want to add like has(), reset(), etc.
	},
	settings   : {
		get(property: string) {
			return ipcRenderer.sendSync('electron-store-get', `settings.${property}`);
		},
		set(property: string, val: any) {
			ipcRenderer.send('electron-store-set', `settings.${property}`, val);
		},
		del(property: string) {
			ipcRenderer.send('electron-store-del', `settings.${property}`);
		}
		// Other method you want to add like has(), reset(), etc.
	},
	projects   : {
		getAll() {
			return ipcRenderer.sendSync('electron-project-getAll');
		},
		getProject(id: number) {
			ipcRenderer.send('electron-project-getProject', id);
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on('electron-project-update', callback);
			return () => ipcRenderer.removeListener('electron-project-update', callback);
		},
		scan() {
			ipcRenderer.send('electron-project-scan');
		},
		add() {
			ipcRenderer.send('electron-project-add');
		},
		open(id: number) {
			ipcRenderer.send('electron-ide-execute', id);
		},
		openFolder(id: number) {
			ipcRenderer.send('electron-project-open-folder', id);
		},
		config(id: number, key: string, value: any) {
			ipcRenderer.send('electron-project-set', id, key, value);
		},
		changeLogo(id: number) {
			ipcRenderer.send('electron-project-change-logo', id);
		},
		remove(id: number) {
			ipcRenderer.send('electron-project-remove', id);
		},
		delete(id: number) {
			ipcRenderer.send('electron-project-delete', id);
		}
	},
	ides       : {
		getAll() {
			return ipcRenderer.sendSync('electron-ide-getAll');
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on('electron-ide-update', callback);
			return () => ipcRenderer.removeListener('electron-ides-update', callback);
		},
		add(property: string) {
			ipcRenderer.send('electron-ide-add', property);
		}
	},
	tray       : {
		close(){
			ipcRenderer.send('electron-close-tray');
		}
	}
};
contextBridge.exposeInMainWorld('electron', bridge);
