import { exec }                                           from 'child_process';
import { app }                                            from 'electron';
import Path                                               from 'path';
import path                                               from 'path';
import ejs                                                from 'ejs';
import PM_Storage, { Tables }                             from '../Storage/PM_Storage';
import PM_FileSystem                                      from '../Utils/PM_FileSystem';
import { Project }                                        from '../Projects/Project';
import { ProgramCommandVars, ProgramFields, ProgramType } from '../../../types/project';

export class Program implements ProgramFields {
	readonly table                = Tables.programs;
	public id: number             = 0;
	public executePath: string    = '';
	public executeCommand: string = '';
	public name: string           = ''; // unique identifier
	public label: string          = ''; // user-friendly program name or language key
	public logo: string           = ''; // icon program
	public color: string          = ''; // background color for icon
	public isNew: boolean         = true;
	public type: ProgramType;
	public project?: Project;

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

	setProject(project: Project) {
		this.project = project;
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

	static getVars(program: Program, project?: Project): ProgramCommandVars {
		const projectData: { [p: `PROJECT_${string}`]: string | undefined } = {};
		if (project) {
			projectData.PROJECT_NAME = project.getVal<string>('name');
			projectData.PROJECT_PATH = project.getVal<string>('path');
		} else {
			projectData.PROJECT_NAME = undefined;
			projectData.PROJECT_PATH = undefined;
		}
		const ProgramData: { [p: `PROGRAM_${string}`]: string | undefined } = {};
		ProgramData.PROGRAM_PATH                                            = program.executePath;
		ProgramData.PROGRAM_NAME                                            = program.name;
		ProgramData.PROGRAM_TYPE                                            = program.type;
		return Object.assign(process.env, projectData, ProgramData);
	}

	private execParse(): string {
		return ejs.render(this.executeCommand, Program.getVars(this, this.project));
	}

	async check(): Promise<boolean> {
		if (this.isNew) {
			throw new Error('Is new');
		}
		return PM_FileSystem.fileExists(this.executePath);
	}

	toObject(): ProgramFields {
		return {
			executePath   : this.executePath,
			type          : this.type,
			id            : this.id,
			color         : this.color,
			logo          : this.logo,
			name          : this.name,
			label         : this.label,
			executeCommand: this.executeCommand
		};
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

	static async fromPath(path: string, type: ProgramType) {
		if (!await PM_FileSystem.fileExists(path)) {
			throw new Error('Invalid path');
		}
		const p       = new Program(type);
		p.executePath = path;
		p.setName(Path.basename(path, Path.extname(path)));
		p.isNew = false;
		return p;
	}

	async save() {
		if (!this.id) {
			this.id = PM_Storage.getNextId(this.table);
		}
		if (!this.name) {
			throw new Error('Invalid program name');
		}
		if (!this.label) {
			this.label = this.name;
		}
		if (!this.executePath) {
			throw new Error('Invalid program executePath');
		}
		if (!this.color) {
			this.color = 'transparent';
		}
		if (!this.logo) {
			const logoPath = path.join(app.getPath('userData'), 'programs', `${this.name}.ico`).replaceAll('\\', '/');
			if (!await PM_FileSystem.exists(logoPath)) {
				const data = await PM_FileSystem.getIconByFile(this.executePath);
				await PM_FileSystem.writeFile(logoPath, data, 'base64');
			}
			this.logo = logoPath;
		}
		PM_Storage.commit<ProgramFields>(this.table, this.id, {
			id            : this.id,
			executePath   : this.executePath,
			executeCommand: this.executeCommand,
			name          : this.name,
			label         : this.label,
			logo          : this.logo,
			color         : this.color,
			type          : this.type
		},['name']);
		return this;
	}
}

export default Program;
