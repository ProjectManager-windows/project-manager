import { useMemo } from 'react';
import rng         from 'seedrandom';

export const useLogo = (props: { type: 'ide' | 'project' | 'technology'|'terminal', name: string, color?: string, logo?: string, style?: any, className?: string }) => {
	const {
			  type, name, color, logo, style, className
		  }     = props;
	const image = useMemo(() => {
		let newColor;
		let newStyle = {};
		if (style) {
			newStyle = style;
		}
		if (!color) {
			const backgroundColors = [
				'#F44336', '#E91E63', '#9C27B0',
				'#673AB7', '#3F51B5', '#2196F3',
				'#03A9F4', '#00BCD4', '#009688',
				'#4CAF50', '#8BC34A', '#CDDC39',
				'#FFEB3B', '#FFC107', '#FF9800',
				'#FF5722', '#795548', '#607D8B'
			];
			newColor               = backgroundColors[Math.floor(rng(name)() * (backgroundColors.length - 1))];
		} else {
			newColor = color;
		}
		if (logo) {
			return { background: `${newColor} url(${logo}) no-repeat scroll 50% 50% `, ...newStyle };
		}
		// const color = backgroundColors[random.int(0, backgroundColors.length)];
		const n   = name.charAt(0).toUpperCase();
		const img = `data:image/svg+xml;base64,${window.btoa(`
<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'>
	<g>
		<ellipse stroke-width='0' stroke='#000' ry='18' rx='18' id='svg_1' cy='20' cx='20' fill='${newColor}'/>
		<text font-weight='bold' font-family='Fira Code' text-anchor='middle' dominant-baseline='middle' font-size='24' stroke-width='0' id='svg_2' y='22.5' x='20' stroke='#000' fill='#fff'>${n}</text>
	</g>
</svg>
		`.trim())}`;
		return { background: `${newColor} url(${img}) no-repeat scroll 50% 50%`, ...newStyle };
	}, [name, color, logo, style]);
	return (<img src={window.pixel} className={`logo ${type}-${name} ${className || ''}`} style={image} alt={name} />);

};
export default useLogo;
