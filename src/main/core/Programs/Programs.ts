import { ipcMain }                                       from 'electron';
import PM_Storage, { Tables }                            from '../Storage/PM_Storage';
import { Program }                                       from './Program';
import { BackgroundEvents }                              from '../../../types/Events';
import { ProgramFields, ProgramFieldsKeys, ProgramType } from '../../../types/project';
import APP                                               from '../../main';
import PM_FileSystem                                     from '../Utils/PM_FileSystem';
import Projects                                          from '../Projects/Projects';
import Settings                                          from '../Settings';
import ProgressBar                                       from '../Notifications/ProgressBar';
import { getInstalledPrograms, windowsProgramType }      from '../../components/exe/getInstalledPrograms';
import path                                              from 'path';
import { Notification }                                  from '../Notifications/Notification';
import { cmdExist }                                      from '../Utils/Promisses';

export class Programs {
	private static instance: Programs;
	private static scan_index: number = 0;

	public programsData: { [p: string]: ProgramFields } | undefined;

	constructor() {
		this.programsData = PM_Storage.getAll<ProgramFields>(Tables.programs);
		ipcMain.on(BackgroundEvents.ProgramsGetAll, (event, type?: ProgramType) => {
			event.returnValue = this.getPrograms(type);
		});
		ipcMain.on(BackgroundEvents.ProgramCreate, async (event, data: { path: string, type: ProgramType }) => {
			event.returnValue = (await Program.fromPath(data.path, data.type)).save();
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.ProgramUpdate);
			}, 200);
		});
		ipcMain.on(BackgroundEvents.ProgramEdit, async (_event, data: { id: number, key: ProgramFieldsKeys, value: any }) => {
			if (!data.id) {
				throw new Error('Program not found');
			}
			const program = Program.fromId(data.id);
			switch (data.key) {
				case 'color':
					if (program.getColor() === data.value) return;
					program.setColor(data.value);
					break;
				case 'name':
					if (program.getName() === data.value) return;
					program.setName(data.value);
					break;
				case 'label':
					if (program.getLabel() === data.value) return;
					program.setLabel(data.value);
					break;
				case 'logo':
					if (program.getLogo() === data.value) return;
					program.setLogo(data.value);
					break;
				case 'executeCommand':
					if (program.executeCommand === data.value) return;
					program.executeCommand = data.value;
					break;
				default:
					return;
			}
			await program.save();
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.ProgramUpdate);
			}, 200);
		});
		ipcMain.on(BackgroundEvents.ProgramDelete, async (_event, id: number) => {
			await Program.fromId(id).delete();
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.ProgramUpdate);
			}, 200);
		});
		ipcMain.on(BackgroundEvents.ProgramGetCommandVars, async (event, data: { programId: number | string, projectId?: number | string }) => {
			let project;
			let program;
			if (data.projectId) {
				if (typeof data.projectId === 'string') {
					project = Projects.getById(parseInt(data.projectId, 10));
				} else {
					project = Projects.getById(data.projectId);
				}
			}
			if (typeof data.programId === 'string') {
				program = this.getById(parseInt(data.programId, 10));
			} else {
				program = this.getById(data.programId);
			}
			if (program) {
				try {
					let result = {};
					if (project) {
						result = Program.getVars(program, project);
					} else {
						result = Program.getVars(program);
					}
					event.returnValue = result;
				} catch (e) {
					console.error(e);
					event.returnValue = {};
				}
			}
		});
		ipcMain.on(BackgroundEvents.ProgramRunWithProject, async (_event, data: { programId: number | string, projectId: number | string }) => {
			let project;
			let program;
			if (typeof data.projectId === 'string') {
				project = Projects.getById(parseInt(data.projectId, 10));
			} else {
				project = Projects.getById(data.projectId);
			}
			if (typeof data.programId === 'string') {
				program = this.getById(parseInt(data.programId, 10));
			} else {
				program = this.getById(data.programId);
			}

			if (project && program) {
				try {
					program.setProject(project);
					program.run();
				} catch (e) {
					console.log(e);
				}
			}
			// event.returnValue = Program.fromId(data.projectId).setProject()
		});
		ipcMain.on(BackgroundEvents.IdeExecute, async (_event, projectId) => {
			const defaultIde = Number(Settings.get(`default.${ProgramType.ide}`));
			const project    = Projects.getById(projectId);
			let ideId: number;
			if (project.getVal(ProgramType.ide)) {
				ideId = project.getVal(ProgramType.ide);
			} else {
				ideId = defaultIde || 1;
			}
			try {
				const ide = Program.fromId(ideId);
				ide.setProject(project);
				_event.returnValue = await ide.run();
			} catch (e) {
				_event.returnValue = false;
			}
		});
		ipcMain.on(BackgroundEvents.TerminalExecute, async (_event, projectId) => {
			const defaultTerminal = Number(Settings.get(`default.${ProgramType.terminal}`));
			const project         = Projects.getById(projectId);
			let terminalsId: number;
			if (project.getVal('terminal')) {
				terminalsId = project.getVal('terminal');
			} else {
				terminalsId = defaultTerminal || 1;
			}
			try {
				const ide = Program.fromId(terminalsId);
				ide.setProject(project);
				_event.returnValue = await ide.run();
			} catch (e) {
				_event.returnValue = false;
			}
		});
		ipcMain.on(BackgroundEvents.ProgramScan, async (_event) => {
			_event.returnValue = await this.scan();
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.ProgramUpdate);
			}, 200);
		});
		ipcMain.on(BackgroundEvents.ProgramCommandDebug, async (_event, data: { programId: number | string, projectId: number | string }) => {
			const returnVal: { errors: string[], commands: string[] } = {
				errors  : [],
				commands: []
			};
			let project;
			let program;
			if (typeof data.projectId === 'string') {
				project = Projects.getById(parseInt(data.projectId, 10));
			} else {
				project = Projects.getById(data.projectId);
			}
			if (typeof data.programId === 'string') {
				program = this.getById(parseInt(data.programId, 10));
			} else {
				program = this.getById(data.programId);
			}
			if (project && program) {
				try {
					program.setProject(project);
					returnVal.commands = program.execParse();
				} catch (e: any) {
					if (e?.message) {
						returnVal.errors.push(e?.message);
					} else {
						returnVal.errors.push('Unknown error');
					}
				}
			}

			return _event.returnValue = returnVal;
		});
	}

	public getById(projectId: number) {
		return Program.fromId(projectId);
	}

	public async init() {
		PM_Storage.init(Tables.programs);
		console.log('Programs INIT');
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Programs();
		}
		return this.instance;
	}

	getPrograms(type?: ProgramType) {
		this.programsData                            = PM_Storage.getAll<ProgramFields>(Tables.programs);
		const list: { [key: string]: ProgramFields } = {};
		if (this.programsData) {
			for (const key in this.programsData) {
				const data = this.programsData[key];
				if (data.name) {
					if (!type || type === data.type) {
						list[key] = (Program.fromId(parseInt(key, 10)).toObject());
					}
				}
			}
		}
		return list;
	}

	async scan() {
		Programs.scan_index++;
		const bar         = new ProgressBar(`scan_programs_${Programs.scan_index}`, 'scan_programs');
		const data        = await getInstalledPrograms();
		const DisplayName = new Set();
		bar.setTotal(data.ArrayOfItem.Item.length);
		let i            = 0;
		const cmd        = new Program(ProgramType.terminal);
		const powerShell = new Program(ProgramType.terminal);
		if (await cmdExist('wt')) {
			const wt = new Program(ProgramType.terminal);
			wt.setName('WindowsTerminal');
			wt.setExecutePath(APP.getAssetPath('icons', 'terminal.ico'));
			wt.setLogo(APP.getAssetPath('icons', 'terminal.ico'));
			wt.setExecuteCommand('wt /d "<%-PROJECT_PATH%>"');
			wt.save().catch(console.warn);
		}
		cmd.setName('cmd');
		powerShell.setName('powerShell');
		cmd.setExecutePath('C:/Windows/System32/cmd.exe');
		cmd.setExecuteCommand('start /d "<%-PROJECT_PATH%>"');
		powerShell.setExecuteCommand('start powershell -NoExit');
		powerShell.setExecutePath('C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe');
		await Promise.all([powerShell.save(), cmd.save()]).catch(console.warn);
		await Promise.all(data.ArrayOfItem.Item.map(async (item) => {
			i++;
			if (DisplayName.has(item._attributes.DisplayName)) {
				return;
			}
			DisplayName.add(item._attributes.DisplayName);
			try {
				await this.createProgramFromWindow(item._attributes);
				bar.update({
							   current: i
						   });
			} catch (e: any) {
				const msg = e ? e?.toString() || 'Error' : 'Error';
				bar.update({
							   current: i,
							   message: msg
						   });
				(new Notification('scan_programs_' + i).setName('error scan program').update(msg));
			}
		}));
		bar.stop();
		return;
	}

	async createProgramFromWindow(data: windowsProgramType) {
		if (!await PM_FileSystem.exists(data.InstallLocation)) {
			return;
		}
		if (data.Publisher === 'JetBrains s.r.o.') {
			const jetBrain = new Program(ProgramType.ide);
			jetBrain.setName(data.DisplayName);
			if (data.DisplayName.toLowerCase().includes('phpstorm')) {
				const p = path.join(data.InstallLocation, 'bin', 'phpstorm64.exe');
				if (!await PM_FileSystem.fileExists(p)) {
					throw new Error(`Can not find ${data.DisplayName} executable`);
				}
				jetBrain.setExecutePath(p);
			}
			if (data.DisplayName.toLowerCase().includes('webstorm')) {
				const p = path.join(data.InstallLocation, 'bin', 'webstorm64.exe');
				if (!await PM_FileSystem.fileExists(p)) {
					throw new Error(`Can not find ${data.DisplayName} executable`);
				}
				jetBrain.setExecutePath(p);
			}
			if (data.DisplayName.toLowerCase().includes('intellij')) {
				const p = path.join(data.InstallLocation, 'bin', 'idea64.exe');
				if (!await PM_FileSystem.fileExists(p)) {
					throw new Error(`Can not find ${data.DisplayName} executable`);
				}
				jetBrain.setExecutePath(p);
			}
			await jetBrain.save();
		}
		if (data.DisplayName.toLowerCase().includes('visual studio code')) {
			const mico = new Program(ProgramType.ide);
			mico.setName(data.DisplayName);
			const p = path.join(data.InstallLocation, 'Code.exe');
			if (!await PM_FileSystem.fileExists(p)) {
				throw new Error(`Can not find ${data.DisplayName} executable`);
			}
			mico.setExecutePath(p);
			await mico.save();
		} else if (data.DisplayName.toLowerCase().includes('visual studio')) {
			const mico = new Program(ProgramType.ide);
			mico.setName(data.DisplayName);
			const p = path.join(data.InstallLocation, 'Common7', 'IDE', 'devenv.exe');
			if (!await PM_FileSystem.fileExists(p)) {
				throw new Error(`Can not find ${data.DisplayName} executable`);
			}
			mico.setExecutePath(p);
			await mico.save();
		}
	}
}

export default Programs.getInstance();
