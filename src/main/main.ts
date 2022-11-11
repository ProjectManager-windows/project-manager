import { app, BrowserWindow, BrowserWindowConstructorOptions, dialog, ipcMain, KeyboardEvent, Menu, screen, shell, Tray } from 'electron';
import Store                                                                                                              from 'electron-store';
import path                                                                                                               from 'path';
import { autoUpdater }                                                                                                    from 'electron-updater';
import log                                                                                                                from 'electron-log';
import MenuBuilder                                                                                                        from './menu';
import { resolveHtmlPath }                                                                                                from './util';
import Projects                                                                                                           from './core/Projects/Projects';
import events                                                                                                             from './ipcMain';
import { BackgroundEvents }                                                                                               from '../types/Events';
import Programs                                                                                                           from './core/Programs/Programs';
import Folders                                                                                                            from './core/Folders/Folders';
import plugins                                                                                                            from './components/plugins';
import Interceptor                                                                                                        from './cli/Interceptor';
import { checkAvailable, checkProject }                                                                                   from './components/plugins/Plugin';


class TrayEventManager {
	private static instance: TrayEventManager;
	private scope: PM_App;
	private readonly tray: Tray;
	private readonly windowTray: BrowserWindow;

	private blur: boolean        = false;
	private close: boolean       = false;
	private click: boolean       = false;
	private doubleClick: boolean = false;
	private hide: boolean        = false;
	private running: boolean     = false;

	static getInstance(scope: PM_App, tray: Tray, windowTray: BrowserWindow) {
		if (!this.instance) {
			this.instance = new TrayEventManager(scope, tray, windowTray);
		}
		return this.instance;
	}

	private constructor(scope: PM_App, tray: Tray, windowTray: BrowserWindow) {
		this.scope      = scope;
		this.tray       = tray;
		this.windowTray = windowTray;
		this.windowTray.on('blur', async (event: any) => {
			this.blur = true;
			await this.run(event);
		});
		this.windowTray.on('close', async (event) => {
			this.close = true;
			await this.run(event);
		});
		this.tray.on('click', async (event) => {
			this.click = true;
			await this.run(event);
		});
		this.tray.on('double-click', async (event) => {
			this.doubleClick = true;
			await this.run(event);
		});
		ipcMain.on(BackgroundEvents.CloseTray, async (event) => {
			this.hide = true;
			await this.run(event);
		});
	}

	async getEvent() {
		return new Promise<'blur' | 'close' | 'show' | 'doubleClick' | 'hide' | false>((resolve) => {
			setTimeout(() => {
				if (this.close) return resolve('close');
				if (this.hide) return resolve('hide');
				if (this.doubleClick) return resolve('doubleClick');
				if (this.blur && !this.click) return resolve('hide');

				if (this.blur && this.click && !this.doubleClick) {
					if (this.windowTray.isVisible()) {
						resolve('hide');
					} else {
						resolve('show');
					}
					return;
				}
				if (this.click && !this.doubleClick) {
					if (this.windowTray.isVisible()) {
						resolve('hide');
					} else {
						resolve('show');
					}
					return;
				}
				resolve(false);
			}, 200);
		});
	}

	async run(event: Event | KeyboardEvent) {
		if (this.running) {
			return;
		}
		this.running     = true;
		const type       = await this.getEvent();
		this.running     = false;
		this.blur        = false;
		this.close       = false;
		this.click       = false;
		this.hide        = false;
		this.doubleClick = false;
		// eslint-disable-next-line default-case
		switch (type) {
			case'doubleClick':
				if (this.scope.mainWindow && !this.scope.mainWindow.isVisible()) {
					this.scope.mainWindow.show();
				}
				return;
			case'show':
				this.windowTray.setOpacity(0);
				this.windowTray.show();
				setTimeout(() => {
					this.windowTray.setOpacity(1);
				}, 10);
				return;
			case'hide':
				this.windowTray.setOpacity(0);
				setTimeout(() => {
					this.windowTray.hide();
				}, 10);
				return;
			case'close':
				if (!this.windowTray) return;
				if ('preventDefault' in event) {
					event.preventDefault();
				}
				this.windowTray.hide();

		}
	}
}


export class PM_App {
	private static instance: PM_App;
	public mainWindow: BrowserWindow | null = null;
	public readonly isDebug: boolean;
	public isRunning: boolean               = false;
	public tray: Tray | null                = null;
	public windowTray: BrowserWindow | null = null;
	public app: typeof app;
	private TrayWindowWidth: number         = 440;
	private TrayWindowHeight: number        = 700;
	public TrayEventManager?: TrayEventManager;

	private constructor() {
		this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
		if (process.env.NODE_ENV === 'production') {
			// eslint-disable-next-line global-require
			const sourceMapSupport = require('source-map-support');
			sourceMapSupport.install();
		}
		this.app = app;
	}

	getAssetPath(...paths: string[]): string {
		const RESOURCES_PATH = app.isPackaged
							   ? path.join(process.resourcesPath, 'assets')
							   : path.join(__dirname, '../../assets');
		return path.join(RESOURCES_PATH, ...paths).replaceAll('\\', '/');
	};

	static getInstance() {
		if (!this.instance) {
			this.instance = new PM_App();
		}
		return this.instance;
	}

	public run() {
		this.beforeRun();
		this.app
			.whenReady()
			.then(() => {
				// const screenBounds    = screen.getPrimaryDisplay();
				// const widthRatio      = 4;
				// const heightRatio     = 1.6;
				// this.TrayWindowWidth  = Math.round(minmax(screenBounds.workAreaSize.width / widthRatio, 1280 / widthRatio, 2560 / widthRatio));
				// this.TrayWindowHeight = Math.round(minmax(screenBounds.workAreaSize.height / heightRatio, 720 / heightRatio, 1440 / heightRatio));
				const store = new Store();
				if (!store.get('settings.locale')) {
					store.set('settings.locale', app.getLocale());
				}
				store.set('engine.TrayWindowWidth', this.TrayWindowWidth);
				store.set('engine.TrayWindowHeight', this.TrayWindowHeight);
				this.runWindows();
				app.on('activate', () => {
					this.runWindows();
				});
			})
			// eslint-disable-next-line no-console
			.catch(console.log);
		this.app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});
		this.app.on('before-quit', () => {
			Interceptor.close();
			if (this.tray) this.tray.destroy();
			if (this.mainWindow) this.mainWindow.close();
			if (this.windowTray) this.windowTray.close();
		});
		this.app.on('quit', () => {

		});
	}

	private runWindows() {
		if (this.mainWindow === null) {
			this.createWindow().then(() => console.log('ok')).catch((err) => console.log(err));
		}
		if (this.windowTray === null) {
			this.createTray().then(() => console.log('ok')).catch((err) => console.log(err));
		}
	}

	private afterRun() {
		if (this.mainWindow) {
			const changeWindowState = () => {
				if (this.mainWindow) {
					this.mainWindow.webContents.send('change-window-state', {
						isMinimized: this.mainWindow.isMinimized(),
						isMaximized: this.mainWindow.isMaximized(),
						isVisible  : this.mainWindow.isVisible(),
						isFocused  : this.mainWindow.isFocused()
					});
				}
			};
			this.mainWindow.on('show', changeWindowState);
			this.mainWindow.on('hide', changeWindowState);
			this.mainWindow.on('blur', changeWindowState);
			this.mainWindow.on('focus', changeWindowState);
			this.mainWindow.on('restore', changeWindowState);
			this.mainWindow.on('resized', changeWindowState);
			this.mainWindow.on('maximize', changeWindowState);
			this.mainWindow.on('minimize', changeWindowState);
			this.mainWindow.on('unmaximize', changeWindowState);
		}
		// globalShortcut.register('CommandOrControl+m', () => {
		// 	if (!this.windowTray) return;
		// 	this.windowTray.setOpacity(0);
		// 	this.windowTray.show();
		// 	setTimeout(() => {
		// 		if (!this.windowTray) return;
		// 		this.windowTray.setOpacity(1);
		// 	}, 10);
		// });
		Interceptor.init();
	}

	private appEvents() {
		ipcMain.on(BackgroundEvents.AppClose, async () => {
			this.app.quit();
		});
		ipcMain.on(BackgroundEvents.AppToggleMinimize, async () => {
			if (!this.mainWindow) return;
			this.mainWindow.isMinimized() ? this.mainWindow.restore() : this.mainWindow.minimize();
		});
		ipcMain.on(BackgroundEvents.AppToggleMaximize, async () => {
			if (!this.mainWindow) return;
			this.mainWindow.isMaximized() ? this.mainWindow.unmaximize() : this.mainWindow.maximize();
		});

		ipcMain.on(BackgroundEvents.AppHide, async () => {
			if (!this.mainWindow) return;
			this.mainWindow.hide();
		});
		ipcMain.on(BackgroundEvents.AppShow, async () => {
			if (!this.mainWindow) return;
			this.mainWindow.show();
		});
		ipcMain.on(BackgroundEvents.AppToggleShow, async () => {
			if (!this.mainWindow) return;
			this.mainWindow.isVisible() ? this.mainWindow.show() : this.mainWindow.hide();
		});

		ipcMain.on(BackgroundEvents.AppIsMinimized, async (event) => {
			if (!this.mainWindow) {
				event.returnValue = false;
				return;
			}
			event.returnValue = this.mainWindow.isVisible();
		});
		ipcMain.on(BackgroundEvents.AppIsHide, async (event) => {
			if (!this.mainWindow) {
				event.returnValue = false;
				return;
			}
			event.returnValue = this.mainWindow.isVisible();
		});
		ipcMain.on(BackgroundEvents.AppIsMaximized, async (event) => {
			if (!this.mainWindow) {
				event.returnValue = false;
				return;
			}
			event.returnValue = this.mainWindow.isVisible();
		});

		ipcMain.on(BackgroundEvents.inputFile, async (event, extensions = []) => {
			const file      = await dialog.showOpenDialog(
				{
					properties: ['openFile'],
					filters   : [
						{
							name      : '',
							extensions: extensions
						}]
				});
			let returnValue = '';
			if (!file.canceled) {
				[returnValue] = file.filePaths;
			}
			event.returnValue = returnValue;
		});
		ipcMain.on(BackgroundEvents.AppUpdate, async () => {
			await autoUpdater.checkForUpdatesAndNotify().then(r => console.log(r));
		});
	}

	private beforeRun() {
		this.appEvents();
		// (new Store).clear();
		events.run();
		Projects.init().then(console.info).catch(console.error);
		Programs.init().then(console.info).catch(console.error);
		Folders.init().then(console.info).catch(console.error);
		// init Plugins
		Promise.all(plugins.map(async (plugin) => {
			return plugin.getInstance().init();
		})).then(console.info).catch(console.error);
		ipcMain.on(BackgroundEvents.checkProject, async (event, data: { name: string, projectId: number }) => {
			try {
				event.returnValue = await checkProject(data.name, data.projectId);
			} catch (e) {
				event.returnValue = false;
				console.error(e);
			}
		});
		ipcMain.on(BackgroundEvents.checkAvailable, async (event, data: { name: string }) => {
			try {
				event.returnValue = await checkAvailable(data.name);
			} catch (e) {
				event.returnValue = false;
				console.error(e);
			}
		});

	}

	async sendRenderEvent(channel: BackgroundEvents, ...args: any[]) {
		return Promise.all([
							   new Promise<void>((resolve, reject) => {
								   const send = (channel: BackgroundEvents, ...args: any[]) => {
									   if (this.mainWindow) {
										   this.mainWindow.webContents.send(channel, ...args);
										   resolve();
									   }
								   };
								   if (this.mainWindow && this.isRunning) {
									   send(channel, ...args);
								   } else {
									   let trys       = 0;
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
							   }),
							   new Promise<void>((resolve, reject) => {
								   const send = (channel: BackgroundEvents, ...args: any[]) => {
									   if (this.windowTray) {
										   this.windowTray.webContents.send(channel, ...args);
										   resolve();
									   }
								   };
								   if (this.windowTray && this.isRunning) {
									   send(channel, ...args);
								   } else {
									   let trys       = 0;
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
							   })
						   ]);
	}

	private async createWindow() {
		if (this.isDebug) {
			// await this.installExtensions();
		}
		this.mainWindow = new BrowserWindow(
			{
				minWidth      : this.TrayWindowWidth + 50,
				show          : false,
				frame         : false,
				width         : 1024,
				height        : 728,
				type          : 'main',
				icon          : this.getAssetPath('icon.png'),
				webPreferences: {
					webSecurity: false,
					preload    : app.isPackaged
								 ? path.join(__dirname, 'preload.js')
								 : path.join(__dirname, '../../.erb/dll/preload.js')
				}
			});

		this.mainWindow.loadURL(resolveHtmlPath('index.html')).then(r => console.log(r)).catch(r => console.log(r));

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

		this.mainWindow.on('close', (event) => {
			event.preventDefault();
			if (this.mainWindow) this.mainWindow.hide();
		});
		this.mainWindow.on('closed', () => {
			this.mainWindow = null;
		});

		const menuBuilder = new MenuBuilder(this.mainWindow);
		menuBuilder.buildMenu();

		// Open urls in the user's browser
		this.mainWindow.webContents.setWindowOpenHandler((data) => {
			shell.openExternal(data.url).then(r => console.log(r)).catch(r => console.log(r));
			return { action: 'deny' };
		});

		// Remove this if your app does not use auto updates
		this.AppUpdater().then(r => console.log(r));
		return true;
	}

	// @ts-ignore
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
		autoUpdater.logger        = log;
		//TODO
		return autoUpdater.checkForUpdatesAndNotify();
	}

	private async createTray() {
		const screenBounds = screen.getPrimaryDisplay();
		this.tray          = new Tray(this.getAssetPath('icon.ico'));
		const contextMenu  = Menu.buildFromTemplate(
			[
				{
					label: 'quit', type: 'normal', click: () => {
						this.app.quit();
					}
				},
				{
					label: 'open', type: 'normal', click: () => {
						if (this.mainWindow && !this.mainWindow.isVisible()) this.mainWindow.show();
					}
				}
			]
		);
		if (this.tray) {
			this.tray.setToolTip(this.app.getName());
			this.tray.setContextMenu(contextMenu);
			const options: BrowserWindowConstructorOptions = {
				show          : false,
				width         : this.TrayWindowWidth,
				height        : this.TrayWindowHeight,
				icon          : this.getAssetPath('icon.png'),
				type          : 'tray',
				frame         : false,
				fullscreenable: false,
				resizable     : false,
				useContentSize: true,
				transparent   : true,
				alwaysOnTop   : true,
				webPreferences: {
					webSecurity: false,
					preload    : app.isPackaged
								 ? path.join(__dirname, 'preload.js')
								 : path.join(__dirname, '../../.erb/dll/preload.js')
				}
			};
			if (this.mainWindow) {
				// options.parent = this.mainWindow;
			}
			this.windowTray = new BrowserWindow(options);
			if (this.windowTray) {
				this.windowTray.loadURL(resolveHtmlPath('index.html')).then(() => console.log('ok')).catch(() => console.log('err'));
				this.windowTray.setSkipTaskbar(true);
				this.windowTray.setPosition(screenBounds.workAreaSize.width - this.TrayWindowWidth, screenBounds.workAreaSize.height - this.TrayWindowHeight, false);
				if (this.isDebug) {
					this.windowTray.webContents.openDevTools();
				}
				this.TrayEventManager = TrayEventManager.getInstance(this, this.tray, this.windowTray);

			}
		}
	}

}

Object.assign(console, log.functions);
const APP = PM_App.getInstance();
APP.run();
export default APP;
