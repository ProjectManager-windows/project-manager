import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, screen, shell, Tray } from 'electron';
import Store                                                                                       from 'electron-store';
import path                                                                                        from 'path';
import { autoUpdater }                                                                             from 'electron-updater';
import log                                                                                         from 'electron-log';
import MenuBuilder                                                                                 from './menu';
import { resolveHtmlPath }                                                                         from './util';
import Projects                                                                                    from './core/Projects/Projects';
import events                                                                                      from './ipcMain';
import IDEs                                                                                        from './core/IDEs/IDEs';
import { minmax }                                                                                  from '../utills/PM_Math';

export class PM_App {
	private static instance: PM_App;
	mainWindow: BrowserWindow | null         = null;
	private readonly isDebug: boolean;
	private isRunning: boolean               = false;
	private tray: Tray | null                = null;
	private windowTray: BrowserWindow | null = null;
	private app: typeof app;
	private TrayWindowWidth: number          = 300;
	private TrayWindowHeight: number         = 600;

	private constructor() {
		this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
		if (process.env.NODE_ENV === 'production') {
			// eslint-disable-next-line global-require
			const sourceMapSupport = require('source-map-support');
			sourceMapSupport.install();
		}
		this.app = app;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new PM_App();
		}
		return this.instance;
	}

	run() {
		this.beforeRun();
		this.app
			.whenReady()
			.then(() => {
				const screenBounds    = screen.getPrimaryDisplay();
				const widthRatio      = 4;
				const heightRatio     = 1.6;
				this.TrayWindowWidth  = Math.round(minmax(screenBounds.workAreaSize.width / widthRatio, 1280 / widthRatio, 2560 / widthRatio));
				this.TrayWindowHeight = Math.round(minmax(screenBounds.workAreaSize.height / heightRatio, 720 / heightRatio, 1440 / heightRatio));
				const store           = new Store();
				if (!store.get('settings.locale')) {
					store.set('settings.locale', app.getLocale());
				}
				store.set('engine.TrayWindowWidth', this.TrayWindowWidth);
				store.set('engine.TrayWindowHeight', this.TrayWindowHeight);
				this.createWindow().then(() => console.log('ok')).catch((err) => console.log(err));
				this.createTray().then(() => console.log('ok')).catch((err) => console.log(err));
				app.on('activate', () => {
					if (this.mainWindow === null) {
						this.createWindow().then(() => console.log('ok')).catch((err) => console.log(err));
						this.createTray().then(() => console.log('ok')).catch((err) => console.log(err));
					}
				});
			})
			.catch(console.log);
		this.app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});
		this.app.on('before-quit', () => {
			if (this.tray) this.tray.destroy();
			if (this.mainWindow) this.mainWindow.close();
			if (this.windowTray) this.windowTray.close();
		});
		this.app.on('quit', () => {

		});
	}

	afterRun() {
	}

	beforeRun() {
		// (new Store).clear();
		events.run();
		Projects.init();
		IDEs.init().then(r => console.log(r)).catch(r => console.log(r));
	}

	getAssetPath(...paths: string[]): string {
		const RESOURCES_PATH = app.isPackaged
							   ? path.join(process.resourcesPath, 'assets')
							   : path.join(__dirname, '../../assets');
		return path.join(RESOURCES_PATH, ...paths);
	};

	async sendRenderEvent(channel: string, ...args: any[]) {

		return Promise.all([
							   new Promise<void>((resolve, reject) => {
								   const send = (channel: string, ...args: any[]) => {
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
								   const send = (channel: string, ...args: any[]) => {
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
						   ]
		);
	}

	public async createWindow() {
		if (this.isDebug) {
			await this.installExtensions();
		}
		this.mainWindow = new BrowserWindow(
			{
				minWidth      : this.TrayWindowWidth + 50,
				show          : false,
				width         : 1024,
				height        : 728,
				type          : 'main',
				icon          : this.getAssetPath('icon.png'),
				webPreferences: {
					preload: app.isPackaged
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
		// eslint-disable-next-line
		this.AppUpdater().then(r => console.log(r));
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

	public async createTray() {
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
		ipcMain.on('electron-close-tray', async () => {
			this.windowTray?.close();
		});
		if (this.tray) {
			this.tray.setToolTip('This is my application.');
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
				kiosk         : true,
				// hasShadow     : false,
				alwaysOnTop   : true,
				webPreferences: {
					backgroundThrottling: false,
					preload             : app.isPackaged
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
				this.windowTray.webContents.openDevTools();
				this.windowTray.on('blur', () => {
					if (!this.windowTray) return;
					if (!this.windowTray.webContents.isDevToolsOpened()) {
						// this.windowTray.hide();
					}
				});
				this.windowTray.on('close', (event) => {
					if (!this.windowTray) return;
					event.preventDefault();
					this.windowTray.hide();
				});
				this.tray.on('click', () => {
					if (!this.windowTray || !this.tray) return;
					if (this.windowTray) {
						if (!this.windowTray.isVisible()) {
							this.windowTray.show();
						} else {
							this.windowTray.hide();
						}
					}
				});
				this.tray.on('double-click', () => {
					if (this.mainWindow && !this.mainWindow.isVisible()) this.mainWindow.show();
				});
			}
		}
	}

}

const APP = PM_App.getInstance();
Object.assign(console, log.functions);
APP.run();
export default APP;
