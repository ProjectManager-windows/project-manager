import { exec }    from 'child_process';
import os          from 'os';
import { IDE }     from '../../core/IDEs/IDE';
import { Project } from '../../core/Projects/Project';
import * as Path   from 'path';

export class PhpStorm extends IDE {

	afterInit(data: { [x: string]: any; id?: number; logo?: any; }) {
		if (!data.logo) {
			this.setVal('logo', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI3MHB4IiBoZWlnaHQ9IjcwcHgiIHZpZXdCb3g9IjAgMCA3MCA3MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzAgNzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAuNTU4IiB5MT0iNDYuODQ1NyIgeDI9IjI5Ljk0NzMiIHkyPSI4LjAyNTYiPgoJCQk8c3RvcCAgb2Zmc2V0PSIxLjYxMjkwM2UtMDAyIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY1QUY4Ii8+CgkJCTxzdG9wICBvZmZzZXQ9IjAuMzgyMSIgc3R5bGU9InN0b3AtY29sb3I6I0IzNDVGMSIvPgoJCQk8c3RvcCAgb2Zmc2V0PSIwLjc1ODEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQTMyOTMiLz4KCQkJPHN0b3AgIG9mZnNldD0iMC45NDA5IiBzdHlsZT0ic3RvcC1jb2xvcjojRkYzMThDIi8+CgkJPC9saW5lYXJHcmFkaWVudD4KCQk8cG9seWdvbiBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzFfKTsiIHBvaW50cz0iMzkuNiwxNS4yIDM2LjMsNS4yIDExLjksMCAwLDEzLjUgMzcuMiwzMi41IAkJIi8+CgkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8yXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIyLjcyOTciIHkxPSI0OC4zNzg4IiB4Mj0iMzIuMDcxOSIgeTI9IjkuNjIwOSI+CgkJCTxzdG9wICBvZmZzZXQ9IjEuNjEyOTAzZS0wMDIiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjVBRjgiLz4KCQkJPHN0b3AgIG9mZnNldD0iMC4zODIxIiBzdHlsZT0ic3RvcC1jb2xvcjojQjM0NUYxIi8+CgkJCTxzdG9wICBvZmZzZXQ9IjAuNzU4MSIgc3R5bGU9InN0b3AtY29sb3I6I0ZBMzI5MyIvPgoJCQk8c3RvcCAgb2Zmc2V0PSIwLjk0MDkiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjMxOEMiLz4KCQk8L2xpbmVhckdyYWRpZW50PgoJCTxwb2x5Z29uIHN0eWxlPSJmaWxsOnVybCgjU1ZHSURfMl8pOyIgcG9pbnRzPSIyOCw0MS40IDI3LjMsMjAuNiAwLDEzLjUgNi43LDUzLjYgMjgsNTMuNCAJCSIvPgoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfM18iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNTAuODU2OCIgeTE9IjQ2LjQwNSIgeDI9IjM0LjI3MzkiIHkyPSI3LjA0ODEiPgoJCQk8c3RvcCAgb2Zmc2V0PSIwLjE4MjgiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjVBRjgiLz4KCQkJPHN0b3AgIG9mZnNldD0iMC4yMzgyIiBzdHlsZT0ic3RvcC1jb2xvcjojODY1NUY2Ii8+CgkJCTxzdG9wICBvZmZzZXQ9IjAuMzQ0OSIgc3R5bGU9InN0b3AtY29sb3I6IzlGNENGMyIvPgoJCQk8c3RvcCAgb2Zmc2V0PSIwLjQ0MjUiIHN0eWxlPSJzdG9wLWNvbG9yOiNBRTQ3RjIiLz4KCQkJPHN0b3AgIG9mZnNldD0iMC41MjE5IiBzdHlsZT0ic3RvcC1jb2xvcjojQjM0NUYxIi8+CgkJPC9saW5lYXJHcmFkaWVudD4KCQk8cG9seWdvbiBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzNfKTsiIHBvaW50cz0iMjIuMSw0MSAyMy40LDI0LjUgNDMuMiw0LjIgNjAuOSw3LjQgNzAsMzAuMSA2MC41LDM5LjUgNDUsMzcgMzUuNCw0Ny4xIAkJIi8+CgkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF80XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI2My4yNjU2IiB5MT0iNTcuMzM4OCIgeDI9IjI0LjY5NzciIHkyPSIyNy41MTU4Ij4KCQkJPHN0b3AgIG9mZnNldD0iMS42MTI5MDNlLTAwMiIgc3R5bGU9InN0b3AtY29sb3I6Izc2NUFGOCIvPgoJCQk8c3RvcCAgb2Zmc2V0PSIwLjM4MjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNCMzQ1RjEiLz4KCQk8L2xpbmVhckdyYWRpZW50PgoJCTxwb2x5Z29uIHN0eWxlPSJmaWxsOnVybCgjU1ZHSURfNF8pOyIgcG9pbnRzPSI0My4yLDQuMiAxNC44LDI5LjQgMjAuMyw2MS44IDQzLjksNzAgNzAsNTQuNCAJCSIvPgoJPC9nPgoJPGc+CgkJPHJlY3QgeD0iMTMuNCIgeT0iMTMuNCIgc3R5bGU9ImZpbGw6IzAwMDAwMDsiIHdpZHRoPSI0My4yIiBoZWlnaHQ9IjQzLjIiLz4KCQk8cmVjdCB4PSIxNy41IiB5PSI0OC41IiBzdHlsZT0iZmlsbDojRkZGRkZGOyIgd2lkdGg9IjE2LjIiIGhlaWdodD0iMi43Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xNy4zLDE5aDcuM2M0LjMsMCw2LjksMi41LDYuOSw2LjJ2MC4xYzAsNC4yLTMuMiw2LjMtNy4zLDYuM2gtM2wwLDUuNGgtMy45TDE3LjMsMTl6IE0yNC40LDI4CgkJCWMyLDAsMy4xLTEuMiwzLjEtMi43di0wLjFjMC0xLjgtMS4yLTIuNy0zLjItMi43aC0zVjI4SDI0LjR6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMi41LDM0LjRsMi4zLTIuOGMxLjYsMS4zLDMuMywyLjIsNS40LDIuMmMxLjYsMCwyLjYtMC42LDIuNi0xLjdWMzJjMC0xLTAuNi0xLjUtMy42LTIuMwoJCQljLTMuNi0wLjktNi0xLjktNi01LjV2LTAuMWMwLTMuMywyLjYtNS40LDYuMy01LjRjMi42LDAsNC45LDAuOCw2LjcsMi4zbC0yLjEsM2MtMS42LTEuMS0zLjItMS44LTQuNy0xLjhjLTEuNSwwLTIuMywwLjctMi4zLDEuNgoJCQl2MC4xYzAsMS4yLDAuOCwxLjYsMy45LDIuNGMzLjYsMSw1LjcsMi4zLDUuNyw1LjR2MC4xYzAsMy42LTIuNyw1LjYtNi42LDUuNkMzNy40LDM3LjMsMzQuNywzNi4zLDMyLjUsMzQuNCIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=');
			this.setVal('color', 'transparent');
		}
		this.setVal('name', 'PhpStorm');
	}

	async isInstalled() {
		const command = 'phpstorm';
		return (new Promise((resolve) => {
			if (os.type().toLowerCase().includes('windows')) {
				exec(`where ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.trim()));
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('linux')) {
				exec(`which  ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.trim()));
					resolve(true);
				});
			}
			if (os.type().toLowerCase().includes('darwin')) {
				exec(`which  ${command}`, (error, path) => {
					if (error) {
						resolve(false);
						return;
					}
					this.setVal('path', Path.dirname(path.trim()));
					resolve(true);
				});
			}
		})) as Promise<boolean>;
	}

	async execute(project: Project): Promise<void> {
		exec(`phpstorm ${project.getVal('path')}`);
	}
}
