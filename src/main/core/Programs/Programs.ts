import { ipcMain }                             from 'electron';
import PM_Storage, { Tables }                  from '../Storage/PM_Storage';
import { Program, ProgramFields, ProgramType } from './Program';
import { BackgroundEvents }                    from '../../../types/Events';

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
		});
		ipcMain.on(BackgroundEvents.ProgramEdit, async (event, data: ProgramFields) => {
			if (!data.id) {
				throw new Error('Program not found');
			}
			const program = Program.fromId(data.id);
			program.setColor(data.color);
			program.setName(data.name);
			program.setLabel(data.label);
			program.setLogo(data.logo);
			event.returnValue = await program.save();
		});
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
		const list: { [key: string]: ProgramFields } = {};
		if (this.programsData) {
			for (const key in this.programsData) {
				const data = this.programsData[key];
				if (data.id) {
					if (!type || type === data.type) {
						list[data.id] = (Program.fromId(data.id).toObject());
					}
				}
			}
		}
		return list;
	}

}

export default Programs.getInstance();
