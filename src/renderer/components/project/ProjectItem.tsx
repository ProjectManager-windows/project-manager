import React, { useContext } from 'react';
import { Ripple }            from 'primereact/ripple';
import { ProjectType }       from '../../../types/project';
import LanguagesBar          from './LanguagesBar';
import useLogo               from '../hooks/useLogo';
import '../../styles/projectItem.scss';
import { ProjectContext }    from '../context/ProjectContext';


const ProjectItem = (props: { active: boolean, project: ProjectType, cm: React.MutableRefObject<any>, defaultAction: (id: number) => void, contextProject: (value: ProjectType) => void, minimal?: boolean }) => {
		  const { project, cm, defaultAction, contextProject, active, minimal } = props;
		  const { selectProject, ides, terminals } = useContext(ProjectContext);
		  const logo                               = useLogo(
			  {
				  type : 'project',
				  name : project.name,
				  color: project?.color,
				  logo : project?.logo
			  });
		  const ideLogo                            = useLogo(
			  {
				  type : 'ide',
				  name : project.ide && ides ? ides[project.ide].name : '',
				  color: project.ide && ides ? ides[project.ide]?.color : '',
				  logo : project.ide && ides ? ides[project.ide]?.logo : ''
			  });
		  const terminalLogo                       = useLogo(
			  {
				  type : 'terminal',
				  name : project.terminal && terminals ? terminals[project.terminal].name : '',
				  color: project.terminal && terminals ? terminals[project.terminal]?.color : '',
				  logo : project.terminal && terminals ? terminals[project.terminal]?.logo : ''
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
					  onClick={() => {
						  if (selectProject) selectProject(project);
					  }}
				  >
					  <Ripple />
					  <div>
						  {logo}
						  <div className='info'>
							  <div className='tp name' data-pr-tooltip={project.name}>{project.name}</div>
							  <div className='notDefaultElems'>
								  {project.ide ? <div className='tp ' data-pr-tooltip={ides && ides[project.ide].name}>{ideLogo}</div> : ''}
								  {project.terminal ? <div className='tp' data-pr-tooltip={terminals && terminals[project.terminal].name}>{terminalLogo}</div> : ''}
							  </div>
							  {minimal ? <pre style={{fontSize:'12px',opacity:0.5,overflow:'hidden',wordBreak:'keep-all',display:'flex'}}>
										   {project.path}
									   </pre> :
							   <LanguagesBar className='languageBar' stats={project.stats} />
							  }
						  </div>
					  </div>
				  </li>
			  </div>
		  );
	  }
;

export default ProjectItem;
