import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import log                                              from 'electron-log';
import { BackgroundEvens }                              from '../types/Enums';

export type Channels = 'ipc-example' | 'electron-progressbar-update' | 'electron-notification-update' | 'test';

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
			return ipcRenderer.sendSync(BackgroundEvens.StoreGet, property);
		},
		set(property: string, val: any) {
			ipcRenderer.send(BackgroundEvens.StoreSet, property, val);
		},
		del(property: string) {
			ipcRenderer.send(BackgroundEvens.StoreDel, property);
		}
		// Other method you want to add like has(), reset(), etc.
	},
	settings   : {
		get(property: string) {
			return ipcRenderer.sendSync(BackgroundEvens.StoreGet, `settings.${property}`);
		},
		set(property: string, val: any) {
			ipcRenderer.send(BackgroundEvens.StoreSet, `settings.${property}`, val);
		},
		del(property: string) {
			ipcRenderer.send(BackgroundEvens.StoreDel, `settings.${property}`);
		}
		// Other method you want to add like has(), reset(), etc.
	},
	projects   : {
		getAll() {
			return ipcRenderer.sendSync(BackgroundEvens.ProjectGetAll);
		},
		getProject(id: number) {
			ipcRenderer.send(BackgroundEvens.ProjectGetProject, id);
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on(BackgroundEvens.ProjectUpdate, callback);
			return () => ipcRenderer.removeListener(BackgroundEvens.ProjectUpdate, callback);
		},
		scan() {
			ipcRenderer.send(BackgroundEvens.ProjectScan);
		},
		add() {
			ipcRenderer.send(BackgroundEvens.ProjectAdd);
		},
		open(id: number) {
			bridge.ides.exec(id);
		},
		openInTerminal(id: number) {
			bridge.terminals.exec(id);
		},
		openFolder(id: number) {
			ipcRenderer.send(BackgroundEvens.ProjectOpenFolder, id);
		},
		config(id: number, key: string, value: any) {
			ipcRenderer.send(BackgroundEvens.ProjectSet, id, key, value);
		},
		changeLogo(id: number) {
			ipcRenderer.send(BackgroundEvens.ProjectChangeLogo, id);
		},
		removeLogo(id: number) {
			ipcRenderer.send(BackgroundEvens.ProjectRemoveLogo, id);
		},
		remove(id: number) {
			ipcRenderer.send(BackgroundEvens.ProjectRemove, id);
		},
		delete(id: number) {
			ipcRenderer.send(BackgroundEvens.ProjectDelete, id);
		}
	},
	ides       : {
		getAll() {
			return ipcRenderer.sendSync(BackgroundEvens.IdeGetAll);
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on(BackgroundEvens.IdeUpdate, callback);
			return () => ipcRenderer.removeListener(BackgroundEvens.IdeUpdate, callback);
		},
		add(property: string) {
			ipcRenderer.send(BackgroundEvens.IdeAdd, property);
		},
		exec(id: number) {
			ipcRenderer.send(BackgroundEvens.IdeExecute, id);

		}
	},
	terminals  : {
		getAll() {
			return ipcRenderer.sendSync(BackgroundEvens.TerminalGetAll);
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on(BackgroundEvens.IdeUpdate, callback);
			return () => ipcRenderer.removeListener('electron-terminal-update', callback);
		},
		add(property: string) {
			ipcRenderer.send('electron-terminal-add', property);
		},
		exec(id: number) {
			ipcRenderer.send(BackgroundEvens.TerminalExecute, id);
		}
	},
	tray       : {
		close() {
			ipcRenderer.send(BackgroundEvens.CloseTray);
		}
	},
	app        : {
		quit() {
			ipcRenderer.send(BackgroundEvens.AppClose);
		},
		toggleMinimize() {
			ipcRenderer.send(BackgroundEvens.AppToggleMinimize);
		},
		toggleMaximize() {
			ipcRenderer.send(BackgroundEvens.AppToggleMaximize);
		},
		hide() {
			ipcRenderer.send(BackgroundEvens.AppHide);
		},
		show() {
			ipcRenderer.send(BackgroundEvens.AppShow);
		},
		onChangeState(func: (...args: any[]) => void): () => void {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
			ipcRenderer.on('change-window-state', subscription);
			return () => ipcRenderer.removeListener('change-window-state', subscription);
		}
	},
	log        : log
};
Object.assign(console, log.functions);
contextBridge.exposeInMainWorld('electron', bridge);
