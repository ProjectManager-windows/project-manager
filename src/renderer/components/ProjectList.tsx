import '../styles/projectList.scss';
import ProjectItem from './ui/ProjectItem';

const ProjectList = (props: { projects: { [key: string]: any } }) => {
	const { projects } = props;
	let forSort        = [];
	const list         = [];

	// eslint-disable-next-line guard-for-in
	for (const projectsKey in projects) {
		const project = projects[projectsKey];
		forSort.push(project);
	}
	forSort = forSort.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	for (const project of forSort) {
		list.push(<ProjectItem key={project.id} project={project} />);
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
