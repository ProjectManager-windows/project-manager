import { useMemo, useState } from 'react';
import { ProjectType }       from '../../../types/project';
import '../../styles/projectItem.scss';

const ProjectItem = (props: { project: ProjectType }) => {
	const { project }       = props;
	const [image, setImage] = useState('');
	useMemo(() => {
		if (project?.logo) {
			setImage(project.logo);
			return;
		}
		const n   = project.name.charAt(0).toUpperCase();
		const img = `data:image/svg+xml;base64,${window.btoa(`
<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'>
	<g>
		<ellipse stroke='#000' ry='18' rx='18' id='svg_1' cy='20' cx='20' fill='#fff'/>
		<text font-weight='bold' font-family='Fira Code' text-anchor='middle' dominant-baseline='middle' font-size='24' stroke-width='0' id='svg_2' y='22.5' x='20' stroke='#000' fill='#000000'>${n}</text>
	</g>
</svg>
		`.trim())}`;
		setImage(img);
	}, [
				project
			]);


	return (
		<div className='projectItem' id={`project-item-${project.id}`}>
			<li className='item' key={project.id}>
				<div>
					<img className='log' alt='logo' src={image} height='40' width='40' />
					<div className='name'>{project.name}</div>
				</div>
			</li>
		</div>
	);
};

export default ProjectItem;
