import { readdir }               from 'fs/promises';
import { PluginType }            from './Plugin';
import { ProjectType }           from '../../../types/project';
import { ipcMain }               from 'electron';
import { BackgroundEvents }      from '../../../types/Events';
import libnpmsearch              from 'libnpmsearch';
import search                    from 'libnpmsearch';
import npmFetch                  from 'npm-registry-fetch';
import { hasTypes, PackageJson } from '../../../types/PackageJson';

export class NpmPlugin extends PluginType {

	static PluginName: string = 'git';

	public constructor(Project: ProjectType) {
		super(Project);
	}

	static async isProject(path: string) {
		const dirs = await readdir(path);
		return dirs.includes('.package.json');
	}

	static async hasTypes(pack: PackageJson): Promise<hasTypes> {
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

	static async init() {
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

	}

	static isTechnologies(path: string) {
		return NpmPlugin.isProject(path);
	}
}

export default NpmPlugin;
