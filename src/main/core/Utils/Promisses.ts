import { promisify } from 'util';
import { exec }      from 'child_process';

export const asyncExec = promisify(exec);

export const cmdExist = async (cmd: string) => {
	return asyncExec(`(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul`).then(() => true).catch(() => false);
};
