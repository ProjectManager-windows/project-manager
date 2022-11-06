import GitPlugin      from './GitPlugin';
import NpmPlugin      from './NpmPlugin';
import { PluginType } from './Plugin';

export const plugins:Array<typeof PluginType> = [
	GitPlugin,
	NpmPlugin
];

export default plugins;
