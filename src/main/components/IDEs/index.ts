import { VsCode }   from './VsCode';
import { PhpStorm } from './PhpStorm';
import { IDEType }  from '../../../types/project';

export default {
	vsCode:new VsCode(),
	phpStorm:new PhpStorm(),
} as {[key: string]: IDEType};
