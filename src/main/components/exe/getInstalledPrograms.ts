import { execFile }  from 'child_process';
import PM_FileSystem from '../../core/Utils/PM_FileSystem';
import App           from '../../main';
import { xml2json }  from 'xml-js';

export type windowsProgramType = {
	DisplayName: string,
	Publisher: string,
	InstallLocation: string,
}
export type windowsProgramTypeList = {
	ArrayOfItem: {
		Item: {
			_attributes: windowsProgramType
		}[]
	}
}

export async function getInstalledPrograms(): Promise<windowsProgramTypeList> {
	const exe = App.getAssetPath('exe', 'GetInstalledPrograms.exe');
	if (await PM_FileSystem.exists(exe)) {
		return new Promise<windowsProgramTypeList>((resolve) => {
			execFile(exe, (error, stdout, stderr) => {
				if (!error) {
					const json = xml2json(stdout, { compact: true });
					const obj  = JSON.parse(json);
					resolve(obj);
					return;
				}
				console.error(stderr);
				throw new Error('getInstalledPrograms');
			});
		});
	}
	throw new Error('getInstalledPrograms');
}
