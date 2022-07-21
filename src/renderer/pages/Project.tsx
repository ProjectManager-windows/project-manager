import '../styles/project.scss';
import { useEffect, useState } from 'react';
import { Tooltip }             from 'primereact/tooltip';
import ProjectList             from '../components/project/ProjectList';
import { ProjectType }         from '../../types/project';
import TechnologiesList        from '../components/technologies/TechnologiesList';
import { ProjectContext }      from '../components/context/ProjectContext';
import { InputText }           from 'primereact/inputtext';
import useSearch               from '../components/hooks/useSearch';

const Project = () => {
	const [projects, setProjects]          = useState(window.electron.projects.getAll());
	const [ides]          = useState(window.electron.ides.getAll());
	const [view, setView]                  = useState((<div />));
	const [selectedProject, selectProject] = useState<ProjectType>();
	const [technology, setTechnology]      = useState<string>('');
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);
	const [searchString, setSearch] = useState('');
	const projectList               = useSearch({ projects, searchString });
	return (
		<ProjectContext.Provider value={{ projects: projectList, setProjects, selectedProject, selectProject, view, setView, technology, setTechnology,ides }}>
			<div className='project'>
				<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
				<div className='grid'>
					<div className='projects'>
						<div className='search'>
						 <span className='p-input-icon-left'>
							<i className='pi pi-search' />
							<InputText className='search-input' value={searchString} onChange={(e) => setSearch(e.target.value)} placeholder='Search' />
						</span>
						</div>
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
