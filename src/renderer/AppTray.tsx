import './styles/App.scss';
import { useEffect, useState } from 'react';
import ProjectList             from './components/project/ProjectList';
import { ProjectContext }      from './components/context/ProjectContext';

export default function AppTray() {
	const [projects, setProjects] = useState(window.electron.projects.getAll());
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);
	return (
		<div id="root-tray">
			<ProjectContext.Provider value={{ projects }}>
				<ProjectList />
			</ProjectContext.Provider>
		</div>
	);
}
