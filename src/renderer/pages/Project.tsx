import '../styles/project.scss';
import { useEffect, useState } from 'react';
import { Tooltip }             from 'primereact/tooltip';
import ProjectList             from '../components/project/ProjectList';
import { ProjectType }         from '../../types/project';
import TechnologiesList        from '../components/technologies/TechnologiesList';
import { ProjectContext }      from '../components/context/ProjectContext';

const Project = () => {
	const [projects, setProjects]          = useState(window.electron.projects.getAll());
	const [view, setView]                  = useState((<div />));
	const [selectedProject, selectProject] = useState<ProjectType>();
	const [technology, setTechnology]      = useState<string>('');
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);
	// const projectSelect      = (e: React.MouseEvent<HTMLElement>, project: ProjectType) => {
	// 	e.preventDefault();
	// 	selectProject(project);
	// };
	// const TechnologiesSelect = (element: JSX.Element) => {
	// 	setView(element);
	// };
	return (
		<ProjectContext.Provider value={{ projects, setProjects, selectedProject, selectProject, view, setView, technology, setTechnology }}>
			<div className='project'>
				<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
				<div className='grid'>
					<div className='projects'>
						<ProjectList />
					</div>
					<div className='technologies'>
						<TechnologiesList />
					</div>
					<div className='view'>
						{view}
					</div>
				</div>
			</div>
		</ProjectContext.Provider>
	);
};

export default Project;
