import phpstorm from './ides/phpstorm.svg';
import vscode   from './ides/vscode.svg';
import gear     from './svg/gear.svg';
import cmd      from './terminals/cmd.svg';
import git      from './terminals/git.svg';

export type Icons = {
	[key: string]: string
	phpstorm: string
	vscode: string
	gear: string
	cmd: string
	git: string
};
export const icons: Icons = {
	phpstorm,
	vscode,
	gear,
	cmd,
	git
};
export default icons;
