import PM_Storage, { Tables }                  from '../Storage/PM_Storage';
import { Program, ProgramFields, ProgramType } from './Program';

export class Programs {
	public programsData: { [p: string]: ProgramFields } | undefined;

	constructor() {
		this.programsData = PM_Storage.getAll<ProgramFields>(Tables.programs);
	}

	getPrograms(type?: ProgramType) {
		const list = new Array<Program>();
		if (this.programsData) {
			for (const key in this.programsData) {
				const data = this.programsData[key];
				if (data.id) {
					if (!type || type === data.type) {
						list.push((new Program(data.type)).fromId(data.id));
					}
				}
			}
		}
		return list;
	}

}
