import '../styles/projectList.scss';
import ProjectItem from './ui/ProjectItem';

const ProjectList = () => {
	const projects = window.electron.projects.getAll();
	const list     = [];

	// eslint-disable-next-line guard-for-in
	for (const projectsKey in projects) {
		const project = projects[projectsKey];
		list.push(<ProjectItem key={projects.id} project={project}/>);
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
