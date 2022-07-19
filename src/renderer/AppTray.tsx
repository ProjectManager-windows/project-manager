import './styles/App.scss';
import './styles/App-tray.scss';
import { useEffect, useState } from 'react';
import ProjectList             from './components/project/ProjectList';
import { ProjectContext }      from './components/context/ProjectContext';
import { InputText }           from 'primereact/inputtext';
import { Tooltip }             from 'primereact/tooltip';
import { FontAwesomeIcon }     from '@fortawesome/react-fontawesome';
import { faClose }             from '@fortawesome/free-solid-svg-icons';

export default function AppTray() {
	const [projects, setProjects] = useState(window.electron.projects.getAll());
	const [search, setSearch]     = useState('');
	useEffect(() => {
		return window.electron.projects.onUpdate(() => {
			setProjects(window.electron.projects.getAll());
		});
	}, []);
	const closeTray = () => {
		window.electron.tray.close();
	};
	return (
		<div className='App-tray'>
			<ProjectContext.Provider value={{ projects }}>
				<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
				<FontAwesomeIcon className='close' icon={faClose} onClick={() => closeTray()} />
				<div className='header'>
					<div className='search'>
						 <span className='p-input-icon-left'>
							<i className='pi pi-search' />
							<InputText className='search-input' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search' />
						</span>
					</div>
				</div>
				<div className='body'>
					<ProjectList />
				</div>
				<div className='footer'>

				</div>
			</ProjectContext.Provider>
		</div>
	);
}
