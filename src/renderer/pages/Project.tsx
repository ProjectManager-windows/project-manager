import '../styles/project.scss';
import { useEffect, useState } from 'react';
import ProjectList             from '../components/project/ProjectList';
import { Tooltip }             from 'primereact/tooltip';

const Project = () => {
	const [projects, setProjects] = useState(window.electron.projects.getAll());
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);
	return (
		<div className='project'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
			<div className='grid'>
				<div className='projects'>
					<ProjectList projects={projects} />
				</div>
				<div className='technologies'>
					test2
				</div>
				<div className='view'>
					test3
				</div>
			</div>
		</div>
	);
};

export default Project;
