import '../styles/projectList.scss';

const ProjectList = () => {
	const projects = window.electron.projects.getAll();
	const list     = [];

	function generateImage(project: any): string {
		const n = project.name.charAt(0).toUpperCase();
		return 'data:image/svg+xml;base64,' + window.btoa(`
<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'>
	<g>
		<ellipse stroke='#000' ry='18' rx='18' id='svg_1' cy='20' cx='20' fill='#fff'/>
		<text  font-weight='bold' font-family='Fira Code' text-anchor='middle' dominant-baseline='middle' font-size='24' stroke-width='0' id='svg_2' y='23' x='19.5' stroke='#000' fill='#000000'>${n}</text>
	</g>
</svg>
		`.trim());
	}

	for (const projectsKey in projects) {
		const project = projects[projectsKey];
		list.push((
					  <li className='item' key={project.id}>
						  <img alt='logo' src={project?.logo || generateImage(project)} height='40' width='40' /> {project.name}
					  </li>
				  ));

	}

	return (
		<div className='projectList'>
			<ul className='list'>
				{list}
			</ul>
		</div>
	);
};

export default ProjectList;
