import * as os  from 'os';
import { exec } from 'child_process';

(async () => {
	console.log(await new Promise((resolve) => {
		if (os.type().toLowerCase().includes("windows")) {
			exec('where phpstorm', (error) => {
				if (error) {
					resolve(false);
					return;
				}
				resolve(true);
			});
		}
		if (os.type().toLowerCase().includes("linux")) {
			exec('which phpstorm', (error) => {
				if (error) {
					resolve(false);
					return;
				}
				resolve(true);
			});
		}
		if (os.type().toLowerCase().includes("darwin")) {
			exec('which phpstorm', (error) => {
				if (error) {
					resolve(false);
					return;
				}
				resolve(true);
			});
		}
	}));
})();



