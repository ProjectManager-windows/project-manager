import { execFile }  from 'child_process';
import { PathLike }  from 'fs';
import PM_FileSystem from '../../core/Utils/PM_FileSystem';
import App           from '../../main';

export type windowsProgramType = {
	DisplayName: string,
	Publisher: string,
	InstallLocation: PathLike,
}


export async function getPrograms(): Promise<windowsProgramType[]> {
	const exe = App.getAssetPath('exe', 'GetInstalledPrograms', 'GetInstalledPrograms.exe');
	if (await PM_FileSystem.exists(exe)) {
		return new Promise<windowsProgramType[]>((resolve) => {
			execFile(exe, (error, stdout,stderr) => {
				if (!error) {
					resolve(JSON.parse(stdout));
					return;
				}
				console.error(stderr);
				resolve([]);
			});
		});
	}
	return [];

}
