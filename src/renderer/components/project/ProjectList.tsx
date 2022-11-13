import '../../styles/project/projectList.scss';
import { useContext, useEffect, useRef, useState }      from 'react';
import { ContextMenu }                                  from 'primereact/contextmenu';
import { faBan, faCode, faFolder, faTerminal, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }                              from '@fortawesome/react-fontawesome';
import { useTranslation }                               from 'react-i18next';
import ProjectItem                                      from './ProjectItem';
import { ProjectType }                                  from '../../../types/project';
import { ProjectContext }                               from '../context/ProjectContext';
import { AppContext }                                   from '../context/AppContext';
import { configure, GlobalHotKeys, KeyMap }             from 'react-hotkeys';

const ProjectList = (props: { minimal: boolean }) => {
		  let { minimal } = props;
		  if (!minimal) minimal = false;
		  const { projects, selectedProject, selectProject, searchString } = useContext(ProjectContext);
		  const { toast }                                                  = useContext(AppContext);
		  const { t }                                                      = useTranslation();
		  const cm                                                         = useRef(null);
		  const wrapper                                                    = useRef<HTMLUListElement>(null);
		  const [contextProject, setContextProject]                        = useState<ProjectType>();
		  let forSort: ProjectType[]                                       = [];
		  const items                                                      = [
			  {
				  label  : t('open in ide').ucfirst(),
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faCode} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  window.electron.projects.open(contextProject.id);
				  }
			  },
			  {
				  label  : t('open folder').ucfirst(),
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faFolder} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  window.electron.projects.openFolder(contextProject.id);
				  }
			  },
			  {
				  label  : t('open terminal').ucfirst(),
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faTerminal} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  window.electron.projects.openInTerminal(contextProject.id);
				  }
			  },
			  {
				  label  : t('remove').ucfirst(),
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faBan} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  window.electron.projects.remove(contextProject.id);
					  toast?.current?.show({ severity: 'success', summary: t('success').ucfirst(), detail: t('project removed'), life: 1500 });
				  }
			  },
			  {
				  label  : t('delete').ucfirst(),
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faTrash} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  // @ts-ignore
					  toast?.current?.show({ severity: 'success', summary: t('success').ucfirst(), detail: t('project deleted'), life: 1500 });
				  }
			  }
		  ];

		  const defaultAction = (id: number) => {

			  window.electron.projects.open(id);
		  };
		  // eslint-disable-next-line guard-for-in
		  for (const projectsKey in projects) {
			  const project = projects[projectsKey];
			  forSort.push(project);
		  }
		  if (!searchString) {
			  console.log(searchString);
			  forSort = forSort.sort((a, b) => {
				  return a?.name?.localeCompare(b?.name);
			  });
		  }
		  const [index, setIndex] = useState(0);
		  useEffect(() => {
			  if (!minimal) return;
			  if (selectProject && forSort[index]) {
				  selectProject(forSort[index]);
			  }
		  }, [forSort, index]);
		  const keyMap: KeyMap = {
			  MOVE_UP  : {
				  name     : 'select up',
				  sequence : '',
				  sequences: ['up', 'num_8'],
				  action   : 'keydown'
			  },
			  MOVE_DOWN: {
				  name     : 'select up',
				  sequence : '',
				  sequences: ['down', 'num_2'],
				  action   : 'keydown'
			  },
			  RUN      : {
				  name     : 'start default action',
				  sequence : '',
				  sequences: ['return', 'space'],
				  action   : 'keypress'
			  }
		  };

		  const handlers: { [key: string]: (keyEvent?: KeyboardEvent) => void } = {
			  MOVE_UP  : () => {
				  if (index <= 0) {
					  setIndex(0);
				  } else {
					  setIndex(index - 1);
				  }
			  },
			  MOVE_DOWN: () => {
				  if (index >= forSort.length - 1) {
					  setIndex(forSort.length - 1);
				  } else {
					  setIndex(index + 1);
				  }
			  },
			  RUN      : () => {
				  if (selectedProject) {
					  defaultAction(selectedProject.id);
				  }
			  }
		  };
		  configure({
						ignoreRepeatedEventsWhenKeyHeldDown: false
					});

		  useEffect(() => {
			  if (!minimal) return;
			  if (selectedProject && selectedProject.id && wrapper && wrapper.current) {
				  const el = document.getElementById(`project-item-${selectedProject.id}`);
				  if (!el) return;
				  const y = el.getBoundingClientRect().top + wrapper.current.scrollTop - el.scrollHeight * 3;
				  wrapper.current.scroll({
											 top: y
										 });
			  }
		  }, [selectedProject]);

		  if (forSort.length > 0) {
			  return (
				  <div className='ProjectList'>
					  <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers} />
					  <ContextMenu model={items} ref={cm} />
					  <ul ref={wrapper} className='list'>
						  {forSort.map((project) => <ProjectItem
							  active={selectedProject?.id === project.id} key={project.id} project={project} contextProject={setContextProject} cm={cm}
							  defaultAction={defaultAction} minimal={minimal}
						  />)}
					  </ul>
				  </div>
			  );
		  }
		  return (
			  <div className='ProjectList'>
				  <ul className='list'>
					  {t('projects not founded')}
				  </ul>
			  </div>
		  );
	  }
;

export default ProjectList;
