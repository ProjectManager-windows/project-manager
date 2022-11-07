import { contextBridge, ipcRenderer, IpcRendererEvent }                                                 from 'electron';
import log                                                                                              from 'electron-log';
import search                                                                                           from 'libnpmsearch';
import path                                                                                             from 'path';
import { BackgroundEvents }                                                                             from '../types/Events';
import { FolderFields, ProgramCommandVars, ProgramFields, ProgramFieldsKeys, ProgramType, ProjectType } from '../types/project';
import npmFetch                                                                                         from 'npm-registry-fetch';
import { PackageJson }                                                                                  from '../types/PackageJson';

export type Channels = 'ipc-example' | 'electron-progressbar-update' | 'electron-notification-update' | 'test';

export const bridge = {
	inputFile() {
		return ipcRenderer.sendSync(BackgroundEvents.inputFile);
	},
	path       : path,
	ipcRenderer: {
		sendMessage(channel: Channels, args: unknown[]) {
			return ipcRenderer.sendSync(channel, args);
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
			return ipcRenderer.sendSync(BackgroundEvents.StoreGet, property);
		},
		set(property: string, val: any) {
			ipcRenderer.send(BackgroundEvents.StoreSet, property, val);
		},
		del(property: string) {
			ipcRenderer.send(BackgroundEvents.StoreDel, property);
		}
		// Other method you want to add like has(), reset(), etc.
	},
	settings   : {
		get<T = any>(property: string): T {
			return ipcRenderer.sendSync(BackgroundEvents.StoreGet, `settings.${property}`);
		},
		set<T = any>(property: string, val: T) {
			ipcRenderer.send(BackgroundEvents.StoreSet, `settings.${property}`, val);
		},
		del(property: string) {
			ipcRenderer.send(BackgroundEvents.StoreDel, `settings.${property}`);
		}
		// Other method you want to add like has(), reset(), etc.
	},
	projects   : {
		getAll(): { [key: string]: ProjectType } {
			return ipcRenderer.sendSync(BackgroundEvents.ProjectGetAll);
		},
		getProject(id: number) {
			ipcRenderer.send(BackgroundEvents.ProjectGetProject, id);
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on(BackgroundEvents.ProjectUpdate, callback);
			return () => ipcRenderer.removeListener(BackgroundEvents.ProjectUpdate, callback);
		},
		scan() {
			ipcRenderer.send(BackgroundEvents.ProjectScan);
		},
		scanFolders(folders: string[]) {
			ipcRenderer.send(BackgroundEvents.ProjectScanFolders, folders);
		},
		add() {
			ipcRenderer.send(BackgroundEvents.ProjectAdd);
		},
		open(id: number) {
			ipcRenderer.send(BackgroundEvents.IdeExecute, id);
		},
		openInTerminal(id: number) {
			ipcRenderer.send(BackgroundEvents.TerminalExecute, id);
		},
		openFolder(id: number) {
			ipcRenderer.send(BackgroundEvents.ProjectOpenFolder, id);
		},
		config(id: number, key: string, value: any) {
			ipcRenderer.send(BackgroundEvents.ProjectSet, id, key, value);
		},
		changeLogo(id: number) {
			ipcRenderer.send(BackgroundEvents.ProjectChangeLogo, id);
		},
		removeLogo(id: number) {
			ipcRenderer.send(BackgroundEvents.ProjectRemoveLogo, id);
		},
		remove(id: number) {
			ipcRenderer.send(BackgroundEvents.ProjectRemove, id);
		},
		delete(id: number) {
			ipcRenderer.send(BackgroundEvents.ProjectDelete, id);
		}
	},
	programs   : {
		getAll(type?: ProgramType): { [key: string]: ProgramFields } {
			return ipcRenderer.sendSync(BackgroundEvents.ProgramsGetAll, type);
		},
		async scan() {
			ipcRenderer.send(BackgroundEvents.ProgramScan);
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on(BackgroundEvents.ProgramUpdate, callback);
			return () => ipcRenderer.removeListener(BackgroundEvents.ProgramUpdate, callback);
		},
		async create(property: { path: string, type: ProgramType }) {
			ipcRenderer.send(BackgroundEvents.ProgramCreate, property);
		},
		async edit(id: number, key: ProgramFieldsKeys, value: any) {
			ipcRenderer.send(BackgroundEvents.ProgramEdit, { id, key, value });
		},
		async delete(id: number) {
			ipcRenderer.send(BackgroundEvents.ProgramDelete, id);
		},
		getCommandVars(programId: number, projectId?: number): ProgramCommandVars {
			return ipcRenderer.sendSync(BackgroundEvents.ProgramGetCommandVars, { programId, projectId });
		},
		async runWithProject(programId: number, projectId: number) {
			ipcRenderer.send(BackgroundEvents.ProgramRunWithProject, { programId, projectId });
		},
		async CommandDebug(programId: number, projectId: number): Promise<{ errors: string[]; commands: string[] }> {

			return ipcRenderer.sendSync(BackgroundEvents.ProgramCommandDebug, { programId, projectId }) as { errors: string[], commands: string[] };
		}
	},
	folders    : {
		getAll(): { [key: string]: FolderFields } {
			return ipcRenderer.sendSync(BackgroundEvents.FoldersGetAll);
		},
		add() {
			ipcRenderer.send(BackgroundEvents.FolderAdd);
		},
		delete(ids: number[]) {
			ipcRenderer.send(BackgroundEvents.FoldersDelete, ids);
		},
		toggle(id: number, value: boolean) {
			ipcRenderer.send(BackgroundEvents.FolderToggle, { id, value });
		},
		onUpdate(callback: () => void): () => void {
			ipcRenderer.on(BackgroundEvents.FolderUpdate, callback);
			return () => ipcRenderer.removeListener(BackgroundEvents.FolderUpdate, callback);
		}

	},
	tray       : {
		close() {
			ipcRenderer.send(BackgroundEvents.CloseTray);
		}
	},
	app        : {
		quit() {
			ipcRenderer.send(BackgroundEvents.AppClose);
		},
		toggleMinimize() {
			ipcRenderer.send(BackgroundEvents.AppToggleMinimize);
		},
		toggleMaximize() {
			ipcRenderer.send(BackgroundEvents.AppToggleMaximize);
		},
		hide() {
			ipcRenderer.send(BackgroundEvents.AppHide);
		},
		show() {
			ipcRenderer.send(BackgroundEvents.AppShow);
		},
		onChangeState(func: (...args: any[]) => void): () => void {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
			ipcRenderer.on('change-window-state', subscription);
			return () => ipcRenderer.removeListener('change-window-state', subscription);
		}
	},
	log        : log,
	npm        : {
		search: async (query: string | ReadonlyArray<string>, opts?: search.Options): Promise<PackageJson[]> => {
			return ipcRenderer.sendSync(BackgroundEvents.NpmSearch, { query, opts }) as unknown as PackageJson[];
		},
		fetch : npmFetch,
		json  : npmFetch.json
	},
	plugins    : {
		async isAvailable(name: string) {
			return ipcRenderer.sendSync(BackgroundEvents.checkAvailable, { name });
		},
		async isProject(name: string, projectId: number) {
			return ipcRenderer.sendSync(BackgroundEvents.checkProject, { name, projectId });
		}
	}

};
Object.assign(console, log.functions);
contextBridge.exposeInMainWorld('electron', bridge);
