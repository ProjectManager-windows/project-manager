import { execFile }  from 'child_process';
import PM_FileSystem from '../../core/Utils/PM_FileSystem';
import App           from '../../main';

export async function getIcon(f: string):Promise<string> {
	const exe = App.getAssetPath('exe', 'IconExtractor.exe');
	if (await PM_FileSystem.exists(exe)) {
		return new Promise((resolve) => {
			execFile(exe, [f], (error, stdout) => {
				if (!error) {
					resolve(stdout);
					return;
				}
				resolve('https://via.placeholder.com/150?text=logo2');
			});
		});
	}
	return 'https://via.placeholder.com/150?text=logo1';

}
