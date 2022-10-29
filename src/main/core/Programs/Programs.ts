import PM_Storage, { Tables }                  from '../Storage/PM_Storage';
import { Program, ProgramFields, ProgramType } from './Program';
import { ipcMain }                             from 'electron';
import { BackgroundEvens }                     from '../../../utills/Enums';
import Settings                                from '../Settings';
import Projects                                from '../Projects/Projects';

export class Programs {
	public programsData: { [p: string]: ProgramFields } | undefined;

	constructor() {
		this.programsData = PM_Storage.getAll<ProgramFields>(Tables.programs);
		ipcMain.on(BackgroundEvens.ProgramsGetAll, async (event, type?: ProgramType) => {
			event.returnValue = this.getPrograms(type);
		});
		ipcMain.on(BackgroundEvens.ProgramsGetProject, async (event, id) => {
			event.returnValue = Program.fromId(id);
		});
		ipcMain.on(BackgroundEvens.ProgramsExecute, async (_event, projectId) => {
			const defaultIde = Number(Settings.get('defaultIde'));
			const project    = Projects.getById(projectId);
			let ideId: number;
			if (project.getVal('ide')) {
				ideId = project.getVal('ide');
			} else {
				ideId = defaultIde || 1;
			}
			const ide          = this.getById(ideId);
			_event.returnValue = await ide.execute(project);
		});
	}

	getById(id: number) {
		return Program.fromId(id);
	}

	getPrograms(type?: ProgramType) {
		const list = new Array<ProgramFields>();
		if (this.programsData) {
			for (const key in this.programsData) {
				const data = this.programsData[key];
				if (data.id) {
					if (!type || type === data.type) {
						list.push(Program.fromId(data.id));
					}
				}
			}
		}
		return list;
	}

}
