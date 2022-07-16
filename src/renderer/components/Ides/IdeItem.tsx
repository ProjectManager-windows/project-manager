import React, { useMemo, useState } from 'react';
import rng                          from 'seedrandom';
import { Ripple }                   from 'primereact/ripple';
import '../../styles/IdeItem.scss';
import { IDEType }                  from '../../../types/project';


const IdeItem = (props: { Ide: IDEType, onSelect: (e: React.MouseEvent<HTMLDivElement>, Ide: IDEType) => void }) => {
	const pixel             = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
	const { Ide, onSelect }  = props;
	const [image, setImage] = useState({});
	useMemo(() => {
		const backgroundColors = [
			'#F44336', '#E91E63', '#9C27B0',
			'#673AB7', '#3F51B5', '#2196F3',
			'#03A9F4', '#00BCD4', '#009688',
			'#4CAF50', '#8BC34A', '#CDDC39',
			'#FFEB3B', '#FFC107', '#FF9800',
			'#FF5722', '#795548', '#607D8B'
		];
		let color;
		if (!Ide?.color) {
			color = backgroundColors[Math.floor(rng(Ide.name)() * (backgroundColors.length - 1))];
		} else {
			color = Ide.color;
		}

		if (Ide?.logo) {
			setImage({ background: `${color} url(${Ide.logo}) no-repeat scroll 50% 50%`, backgroundSize: '70% auto' });
			return;
		}
		// const color = backgroundColors[random.int(0, backgroundColors.length)];
		const n   = Ide.name.charAt(0).toUpperCase();
		const img = `data:image/svg+xml;base64,${window.btoa(`
<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'>
	<g>
		<ellipse stroke-width='0' stroke='#000' ry='18' rx='18' id='svg_1' cy='20' cx='20' fill='${color}'/>
		<text font-weight='bold' font-family='Fira Code' text-anchor='middle' dominant-baseline='middle' font-size='24' stroke-width='0' id='svg_2' y='22.5' x='20' stroke='#000' fill='#fff'>${n}</text>
	</g>
</svg>
		`.trim())}`;
		setImage({ background: `${color} url(${img}) no-repeat scroll 50% 50%` });
	}, [Ide.logo, Ide.name]);
	return (
		<div className='IdeItem ' id={`Ide-item-${Ide.id}`} onClick={e => onSelect(e, Ide)}>
			<li className='item p-ripple' key={Ide.id}>
				<Ripple />
				<div>
					<img className={`logo Ide-logo-${Ide.id}`} alt='logo' src={pixel} style={image} height='40' width='40' />
					<div className='info'>
						<div className='tp name' data-pr-tooltip={Ide.name}>{Ide.name}</div>
					</div>
				</div>
			</li>
		</div>
	);
};

export default IdeItem;
