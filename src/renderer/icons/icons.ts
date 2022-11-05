import gear             from './svg/gear.svg';
import pixel            from './png/pixel.png';
import flag_placeholder from './png/flag_placeholder.png';
import flags_responsive from './png/flags_responsive.png';

export type Icons = {
	[key: string]: string
	gear: string
	pixel: string
	flag_placeholder: string
	flags_responsive: string
};
export const icons: Icons = {
	gear,
	pixel,
	flags_responsive,
	flag_placeholder
};
export default icons;
