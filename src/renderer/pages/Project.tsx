import '../styles/project/project.scss';
import { useEffect, useRef, useState } from 'react';
import { Tooltip }                     from 'primereact/tooltip';
import { InputText }                   from 'primereact/inputtext';
import ProjectList                     from '../components/project/ProjectList';
import { ProjectType }                 from '../../types/project';
import TechnologiesList                from '../components/technologies/TechnologiesList';
import { ProjectContext }              from '../components/context/ProjectContext';
import useSearch                       from '../components/hooks/useSearch';
import { useGridSlide }                from '../components/hooks/useGridSlide';

const Project = () => {
	const [projects, setProjects] = useState(window.electron.projects.getAll());
	const dd1                     = parseInt(window.electron.store.get('view.project.grid.d1'));
	const dd2                     = parseInt(window.electron.store.get('view.project.grid.d2'));
	// const [ides]                           = useState(window.electron.ides.getAll());
	// const [terminals]                      = useState(window.electron.terminals.getAll());
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


	const [s1, d1, reset1] = useGridSlide('t1');
	const [s2, d2, reset2] = useGridSlide('t2');
	const grid             = useRef<HTMLDivElement>(null);
	const p                = useRef<HTMLDivElement>(null);
	const t                = useRef<HTMLDivElement>(null);

	function resizeGrid() {
		if (!grid || !p || !t) return;
		if (!d1 && !d2) return;
		if (grid.current && p.current && t.current) {
			setGridSize(p.current.offsetWidth + d1, t.current.offsetWidth + d2);
			reset1();
			reset2();
		}
	}

	function setGridSize(dd1: number, dd2: number) {
		if (grid.current && p.current && t.current) {
			if (dd1 < 60) {
				dd1 = 60;
			}
			if (dd2 < 60) {
				dd2 = 60;
			}
			window.electron.store.set('view.project.grid.d1', dd1);
			window.electron.store.set('view.project.grid.d2', dd2);
			const st = `grid-template-columns: minmax(60px, ${dd1}px) 3px minmax(60px, ${dd2}px) 3px minmax(60px, 1fr) !important;`;
			grid.current.setAttribute('style', st);
		}
	}

	useEffect(resizeGrid, [d1, d2]);
	useEffect(() => {
		if((!isNaN(dd1) && !isNaN(dd2)) && dd1 || dd2) {
			setGridSize(dd1, dd2)
		}
	}, [dd1, dd2]);
	return (
		<ProjectContext.Provider value={{ projects: projectList, setProjects, selectedProject, selectProject, view, setView, technology, setTechnology }}>
			<div className='project'>
				<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
				<div className='grid' ref={grid}>
					<div id='test1' ref={p} className='projects'>
						<div className='search'>
						 <span className='p-input-icon-left'>
							<i className='pi pi-search' />
							<InputText className='search-input' value={searchString} onChange={(e) => setSearch(e.target.value)} placeholder='Search' />
						</span>
						</div>
						<ProjectList minimal={false} />
					</div>
					{s1}
					<div id='test2' ref={t} className='technologies'>
						<TechnologiesList />
					</div>
					{s2}
					<div className='view'>
						{view}
					</div>
				</div>
			</div>
		</ProjectContext.Provider>
	);
};

export default Project;
