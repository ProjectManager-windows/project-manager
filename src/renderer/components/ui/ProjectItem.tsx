import { useMemo, useState } from 'react';
import rng                   from 'seedrandom';
import { ProjectType }       from '../../../types/project';
import '../../styles/projectItem.scss';
import { Ripple }            from 'primereact/ripple';

const ProjectItem = (props: { project: ProjectType }) => {
	const pixel             = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
	const { project }       = props;
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
		const color            = backgroundColors[Math.floor(rng(project.name)() * (backgroundColors.length - 1))];

		if (project?.logo) {
			setImage({ background: `${color} url(${project.logo}) no-repeat scroll 50% 50%`, backgroundSize: '90% auto' });
			return;
		}
		// const color = backgroundColors[random.int(0, backgroundColors.length)];
		const n   = project.name.charAt(0).toUpperCase();
		const img = `data:image/svg+xml;base64,${window.btoa(`
<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'>
	<g>
		<ellipse stroke-width='0' stroke='#000' ry='18' rx='18' id='svg_1' cy='20' cx='20' fill='${color}'/>
		<text font-weight='bold' font-family='Fira Code' text-anchor='middle' dominant-baseline='middle' font-size='24' stroke-width='0' id='svg_2' y='22.5' x='20' stroke='#000' fill='#fff'>${n}</text>
	</g>
</svg>
		`.trim())}`;
		setImage({ background: `${color} url(${img}) no-repeat scroll 50% 50%` });
	}, [project.logo, project.name]);
	return (
		<div className='projectItem ' id={`project-item-${project.id}`}>
			<li className='item p-ripple' key={project.id} >
				<Ripple />
				<div>
					<img className='logo' alt='logo' src={pixel} style={image} height='40' width='40' />
					<div className='name'>{project.name}</div>
				</div>
			</li>
		</div>
	);
};

export default ProjectItem;
