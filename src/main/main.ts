import { app, BrowserWindow, shell } from 'electron';
import Store                         from 'electron-store';
import path                          from 'path';
import { autoUpdater }               from 'electron-updater';
import log                           from 'electron-log';
import MenuBuilder                   from './menu';
import { resolveHtmlPath }           from './util';
import Projects                      from './core/Projects/Projects';
import events                        from './ipcMain';
import IDEs                          from './core/IDEs/IDEs';

export class PM_App {
	private static instance: PM_App;
	mainWindow: BrowserWindow | null = null;
	private readonly isDebug: boolean;
	private isRunning: boolean       = false;

	private constructor() {
		this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
		if (process.env.NODE_ENV === 'production') {
			// eslint-disable-next-line global-require
			const sourceMapSupport = require('source-map-support');
			sourceMapSupport.install();
		}

	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new PM_App();
		}
		return this.instance;
	}

	run() {
		this.beforeRun();
		app
			.whenReady()
			.then(() => {
				const store = new Store();
				if (!store.get('settings.locale')) {
					store.set('settings.locale', app.getLocale());
				}
				store.get('settings.locale');
				// eslint-disable-next-line promise/no-nesting
				this.createWindow().then(() => console.log('ok')).catch((err) => console.log(err));
				app.on('activate', () => {
					// On macOS it's common to re-create a window in the app when the
					// dock icon is clicked and there are no other windows open.
					if (this.mainWindow === null) {
						// eslint-disable-next-line promise/no-nesting
						this.createWindow().then(() => console.log('ok')).catch((err) => console.log(err));
					}
				});
			})
			.catch(console.log);
	}

	afterRun() {

	}

	beforeRun() {
		// (new Store).clear();
		events.run();
		Projects.init();
		IDEs.init();
	}

	async sendRenderEvent(channel: string, ...args: any[]) {
		return new Promise<void>((resolve, reject) => {
			const send = (channel: string, ...args: any[]) => {
				if (this.mainWindow) {
					this.mainWindow.webContents.send(channel, ...args);
					resolve();
				}
			};
			if (this.mainWindow && this.isRunning) {
				send(channel, ...args);
			} else {
				let trys = 0;
				const interval = setInterval(() => {
					trys++;
					if (trys < 10) {
						send(channel, ...args);
					} else {
						reject();
						clearInterval(interval);
					}
				}, 200);
			}
		});
	}

	private async createWindow() {
		if (this.isDebug) {
			await this.installExtensions();
		}

		const RESOURCES_PATH = app.isPackaged
							   ? path.join(process.resourcesPath, 'assets')
							   : path.join(__dirname, '../../assets');

		const getAssetPath = (...paths: string[]): string => {
			return path.join(RESOURCES_PATH, ...paths);
		};

		this.mainWindow = new BrowserWindow(
			{
				show          : false,
				width         : 1024,
				height        : 728,
				icon          : getAssetPath('icon.png'),
				webPreferences: {
					preload: app.isPackaged
							 ? path.join(__dirname, 'preload.js')
							 : path.join(__dirname, '../../.erb/dll/preload.js')
				}
			});

		this.mainWindow.loadURL(resolveHtmlPath('index.html'));

		this.mainWindow.on('ready-to-show', () => {
			if (!this.mainWindow) {
				throw new Error('"mainWindow" is not defined');
			}
			if (process.env.START_MINIMIZED) {
				this.mainWindow.minimize();
			} else {
				this.mainWindow.show();
				this.isRunning = true;
				this.afterRun();
			}
		});

		this.mainWindow.on('closed', () => {
			this.mainWindow = null;
		});

		const menuBuilder = new MenuBuilder(this.mainWindow);
		menuBuilder.buildMenu();

		// Open urls in the user's browser
		this.mainWindow.webContents.setWindowOpenHandler((edata) => {
			shell.openExternal(edata.url);
			return { action: 'deny' };
		});

		// Remove this if your app does not use auto updates
		// eslint-disable-next-line
		this.AppUpdater();
		return true;
	}

	private async installExtensions() {
		// eslint-disable-next-line global-require
		const installer     = require('electron-devtools-installer');
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		const extensions    = ['REACT_DEVELOPER_TOOLS'];

		return installer
			.default(
				extensions.map((name) => installer[name]),
				forceDownload
			)
			.catch(console.log);
	}

	private async AppUpdater() {
		log.transports.file.level = 'info';
		autoUpdater.logger        = log;
		return autoUpdater.checkForUpdatesAndNotify();
	}
}

const APP = PM_App.getInstance();
APP.run();
export default APP;
