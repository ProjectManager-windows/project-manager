import gear             from './svg/gear.svg';
import pixel            from './png/pixel.png';
import dt               from './svg/dt.svg';
import ts               from './svg/ts.svg';
import js               from './svg/js.svg';
import flag_placeholder from './png/flag_placeholder.png';
import flags_responsive from './png/flags_responsive.png';

export type Icons = {
	[key: string]: string
	gear: string
	pixel: string
	dt: string
	ts: string
	js: string
	flag_placeholder: string
	flags_responsive: string
};
export const icons: Icons = {
	gear,
	pixel,
	dt,
	ts,
	js,
	flags_responsive,
	flag_placeholder
};
export default icons;
