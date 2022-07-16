import '../styles/project.scss';
import React, { useEffect, useState } from 'react';
import ProjectList                    from '../components/project/ProjectList';
import { Tooltip }                    from 'primereact/tooltip';
import { ProjectType }                from '../../types/project';
import TechnologiesList               from '../components/technologies/TechnologiesList';

const Project = () => {
	const [projects, setProjects] = useState(window.electron.projects.getAll());
	const [view, setView] = useState((<div></div>));
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);

	const [selectedProject, selectProject] = useState<ProjectType>();

	const projectSelect      = (e: React.MouseEvent<HTMLDivElement>, project: ProjectType) => {
		e.preventDefault();
		selectProject(project);
	};
	const TechnologiesSelect = (element: JSX.Element) => {
		setView(element)
		console.log(element);
	};
	return (
		<div className='project'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
			<div className='grid'>
				<div className='projects'>
					<ProjectList projects={projects} onSelect={projectSelect} />
				</div>
				<div className='technologies'>
					<TechnologiesList selectedProject={selectedProject} onSelect={TechnologiesSelect} />
				</div>
				<div className='view'>
					{view}
				</div>
			</div>
		</div>
	);
};

export default Project;
