import { exec }               from 'child_process';
import PM_Storage, { Tables } from '../Storage/PM_Storage';
import PM_FileSystem          from '../Utils/PM_FileSystem';

export enum ProgramType {
	ide       = 'Ide',
	terminals = 'Terminals',
}

export interface ProgramFields {
	id?: number;
	executePath: string;
	executeCommand: string;
	name: string;
	label: string;
	logo: string;
	color: string;
	type: ProgramType;
}

export class Program implements ProgramFields {
	readonly table                = Tables.programs;
	public id: number | undefined;
	public executePath: string    = '';
	public executeCommand: string = '';
	public name: string           = ''; // unique identifier
	public label: string          = ''; // user-friendly program name or language key
	public logo: string           = ''; // icon program
	public color: string          = ''; // background color for icon
	public isNew: boolean         = true;
	public type: ProgramType;

	constructor(type: ProgramType) {
		this.type = type;
	}

	getName(): string {
		return this.name;
	}

	setName(value: string) {
		this.name = value;
		return this;
	}

	getLabel(): string {
		return this.label;
	}

	setLabel(value: string) {
		this.label = value;
		return this;
	}

	getLogo(): string {
		if (this.logo) {
			return this.logo;
		}
		return '';
	}

	getColor(): string {
		return this.color;
	}

	getType(): string {
		return this.type;
	}

	setLogo(value: string) {
		this.logo = value;
		return this;
	}

	setColor(value: string) {
		this.color = value;
		return this;
	}

	run() {
		exec(this.execParse());
	}

	private execParse(): string {
		return this.executeCommand;
	}

	async check(): Promise<boolean> {
		if (this.isNew) {
			throw new Error('Is new');
		}
		return PM_FileSystem.fileExists(this.executePath);
	}

	static fromId(id: number) {
		const data = PM_Storage.getById<ProgramFields>(Tables.programs, id);
		if (!data) {
			throw new Error('Invalid program id');
		}
		const p          = new Program(data.type);
		p.id             = id;
		p.executePath    = data.executePath;
		p.executeCommand = data.executeCommand;
		p.setColor(data.color);
		p.setName(data.name);
		p.setLabel(data.label);
		p.setLogo(data.logo);
		p.isNew = false;
		return p;
	}

	save() {
		if (!this.id) {
			this.id = PM_Storage.getNextId(this.table);
		}
		PM_Storage.commit<ProgramFields>(this.table, this.id, {
			executePath   : this.executePath,
			executeCommand: this.executeCommand,
			name          : this.name,
			label         : this.label,
			logo          : this.logo,
			color         : this.color,
			type          : this.type
		});
		return this.id;
	}
}

export default Program;
