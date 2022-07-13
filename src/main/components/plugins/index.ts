import GitPlugin      from './GitPlugin';
import { PluginType } from './Plugin';

export const plugins:{[key: string]: typeof PluginType} = {
	'GitPlugin': GitPlugin
};

export default plugins;
