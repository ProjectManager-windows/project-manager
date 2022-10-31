import path          from 'path';
import { execFile }  from 'child_process';
import PM_FileSystem from '../../core/Utils/PM_FileSystem';

export async function getIcon(f: string) {
	const exe = path.join(__dirname, 'IconExtractor.exe');
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
