import '../styles/project.scss';
import React, { useEffect, useState } from 'react';
import { Tooltip }                    from 'primereact/tooltip';
import ProjectList                    from '../components/project/ProjectList';
import { ProjectType }                from '../../types/project';
import TechnologiesList               from '../components/technologies/TechnologiesList';

const Project = () => {
	const [projects, setProjects]          = useState(window.electron.projects.getAll());
	const [view, setView]                  = useState((<div />));
	const [selectedProject, selectProject] = useState<ProjectType>();
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);
	const projectSelect      = (e: React.MouseEvent<HTMLElement>, project: ProjectType) => {
		e.preventDefault();
		selectProject(project);
	};
	const TechnologiesSelect = (element: JSX.Element) => {
		setView(element);
	};
	return (
		<div className='project'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
			<div className='grid'>
				<div className='projects'>
					<ProjectList selectedProject={selectedProject} projects={projects} onSelect={projectSelect} />
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
