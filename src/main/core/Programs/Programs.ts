import PM_Storage, { Tables }                  from '../Storage/PM_Storage';
import { Program, ProgramFields, ProgramType } from './Program';
import { ipcMain }                             from 'electron';
import { BackgroundEvens }                     from '../../../utills/Enums';

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
