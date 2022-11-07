import { readdir }               from 'fs/promises';
import { Plugin }                from './Plugin';
import { ipcMain }               from 'electron';
import { BackgroundEvents }      from '../../../types/Events';
import libnpmsearch              from 'libnpmsearch';
import search                    from 'libnpmsearch';
import npmFetch                  from 'npm-registry-fetch';
import { hasTypes, PackageJson } from '../../../types/PackageJson';

export class NpmPlugin extends Plugin {

	private static instance: NpmPlugin;

	static getInstance() {
		if (!this.instance) {
			this.instance = new NpmPlugin();
		}
		return this.instance;
	}

	async hasTypes(pack: PackageJson): Promise<hasTypes> {
		if (pack.types) {
			return hasTypes.ts;
		}
		if (pack.devDependencies) {
			if (Object.keys(pack.devDependencies).includes('typescript')) {
				return hasTypes.ts;
			}
		}
		if (pack.dependencies) {
			if (Object.keys(pack.dependencies).includes('typescript')) {
				return hasTypes.ts;
			}
		}
		try {
			const types = await npmFetch.json(`@types/${pack.name}`);
			if (types && types._id) {
				return hasTypes.dt;
			}
		} catch (e) {
			return hasTypes.no;
		}
		return hasTypes.no;
	}

	async init() {
		ipcMain.on(BackgroundEvents.NpmSearch, async (event, data: { query: string | ReadonlyArray<string>, opts?: search.Options }) => {
			const packages    = await libnpmsearch(data.query, data?.opts);
			event.returnValue = await Promise.all(packages.map(async (pack: search.Result) => {
				try {
					const results = [];
					results.push(npmFetch.json(`${pack.name}`));
					results.push(npmFetch.json(`${pack.name}/${pack.version}`));
					const resultsAwaited = await Promise.all(results) as unknown as PackageJson[];
					const result         = Object.assign(resultsAwaited[0], resultsAwaited[1], pack) as unknown as PackageJson;
					result.hasTypes      = await this.hasTypes(result);
					return result;
				} catch (e) {
					return false;
				}
			}));
		});
		return this;
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}

	async isProject(path: string): Promise<boolean> {
		const dirs = await readdir(path);
		return dirs.includes('.package.json');
	}
}
