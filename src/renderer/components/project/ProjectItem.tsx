import React, { useContext } from 'react';
import { Ripple }            from 'primereact/ripple';
import { ProjectType }       from '../../../types/project';
import LanguagesBar          from './LanguagesBar';
import useLogo               from '../hooks/useLogo';
import '../../styles/projectItem.scss';
import { ProjectContext }    from '../context/ProjectContext';

const ProjectItem = (props: { active: boolean, project: ProjectType, cm: React.MutableRefObject<any>, defaultAction: (id: number) => void, contextProject: (value: ProjectType) => void }) => {
		  const { selectProject }                                      = useContext(ProjectContext);
		  const { project, cm, defaultAction, contextProject, active } = props;
		  const logo                                                   = useLogo(
			  {
				  type : 'project',
				  name : project.name,
				  color: project?.color,
				  logo : project?.logo
			  });
		  return (
			  <div className='projectItem ' id={`project-item-${project.id}`}>
				  <li
					  className={`item p-ripple ${active ? 'active' : ''}`}
					  key={project.id}
					  data-project-id={project.id}
					  onContextMenu={(e) => {
						  contextProject(project);
						  cm.current.show(e);
					  }}
					  onDoubleClick={() => defaultAction(project.id)}
					  onClick={() => selectProject(project)}
				  >
					  <Ripple />
					  <div>
						  {logo}
						  <div className='info'>
							  <div className='tp name' data-pr-tooltip={project.name}>{project.name}</div>
							  <LanguagesBar className='languageBar' stats={project.stats} />
						  </div>
					  </div>
				  </li>
			  </div>
		  );
	  }
;

export default ProjectItem;
