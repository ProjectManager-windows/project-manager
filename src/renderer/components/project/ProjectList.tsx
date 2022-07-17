import '../../styles/projectList.scss';
import ProjectItem                 from './ProjectItem';
import React, { useRef, useState } from 'react';
import { ProjectType }             from '../../../types/project';
import { ContextMenu }      from 'primereact/contextmenu';
import { faCode, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';

const ProjectList = (props: { projects: { [key: string]: any }, onSelect: (e: React.MouseEvent<HTMLElement>, ide: ProjectType) => void }) => {
		  const cm                                  = useRef(null);
		  const [contextProject, setContextProject] = useState<ProjectType>();
		  const { projects, onSelect }              = props;
		  let forSort                               = [];
		  const list                                = [];
		  const items                               = [
			  {
				  label  : 'open in ide',
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faCode} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  window.electron.projects.open(contextProject.id);
				  }
			  },
			  {
				  label  : 'open folder',
				  icon   : (<FontAwesomeIcon className='p-menuitem-icon' icon={faFolder} />),
				  command: () => {
					  if (!contextProject) {
						  return;
					  }
					  window.electron.projects.openFolder(contextProject.id);
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
		  forSort = forSort.sort((a, b) => {
			  return a.name.localeCompare(b.name);
		  });
		  for (const project of forSort) {
			  list.push(<ProjectItem onSelect={(e, project) => onSelect(e, project)} key={project.id} project={project} contextProject={setContextProject} cm={cm} defaultAction={defaultAction} />);
		  }
		  return (
			  <div className='ProjectList'>
				  <ContextMenu model={items} ref={cm}></ContextMenu>
				  <ul className='list'>
					  {list}
				  </ul>
			  </div>
		  );
	  }
;

export default ProjectList;
