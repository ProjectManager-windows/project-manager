import { ipcMain }                                       from 'electron';
import PM_Storage, { Tables }                            from '../Storage/PM_Storage';
import { Program }                                       from './Program';
import { BackgroundEvents }                              from '../../../types/Events';
import { ProgramFields, ProgramFieldsKeys, ProgramType } from '../../../types/project';
import APP                                               from '../../main';
import PM_FileSystem                                     from '../Utils/PM_FileSystem';
import fs                                                from 'fs/promises';
import Projects                                          from '../Projects/Projects';
import Settings                                          from '../Settings';

export class Programs {
	private static instance: Programs;

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
			const p = Program.fromId(id);
			if (!p.isNew) {
				if (await PM_FileSystem.fileExists(p.getLogo())) {
					await fs.unlink(p.getLogo());
				}
				PM_Storage.delById(Tables.programs, id);
			}
			setTimeout(() => {
				APP.sendRenderEvent(BackgroundEvents.ProgramUpdate);
			}, 200);
		});
		ipcMain.on(BackgroundEvents.ProgramGetCommandVars, async (event, id: number) => {
			event.returnValue = JSON.parse(JSON.stringify(Program.getVars(Program.fromId(id))));
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
				program.setProject(project);
				program.run();
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
						list[key] = (Program.fromId(parseInt(key)).toObject());
					}
				}
			}
		}
		return list;
	}

}

export default Programs.getInstance();
