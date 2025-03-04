import React, { useContext, useMemo } from 'react';
import { Ripple }                     from 'primereact/ripple';
import { ProgramType, ProjectType }   from '../../../types/project';
import LanguagesBar                   from './LanguagesBar';
import useLogo                        from '../hooks/useLogo';
import '../../styles/project/projectItem.scss';
import { ProjectContext }             from '../context/ProjectContext';


// eslint-disable-next-line react/require-default-props
const ProjectItem = (props: { active: boolean, project: ProjectType, cm: React.MutableRefObject<any>, defaultAction: (id: number) => void, contextProject: (value: ProjectType) => void, minimal?: boolean }) => {
		  const { project, cm, defaultAction, contextProject, active, minimal } = props;
		  const { selectProject }                                               = useContext(ProjectContext);
		  const ides                                                            = useMemo(() => {
			  return window.electron.programs.getAll(ProgramType.ide);
		  }, []);
		  const terminals                                                       = useMemo(() => {
			  return window.electron.programs.getAll(ProgramType.terminal);
		  }, []);
		  const logo                                                            = useLogo(
			  {
				  type : 'project',
				  name : project.name,
				  color: project?.color,
				  logo : project?.logo
			  });
		  const ideLogo                                                         = useLogo(
			  {
				  type : ProgramType.ide,
				  name : project.ide && ides && ides[project.ide] ? ides[project.ide].name : '',
				  color: project.ide && ides && ides[project.ide] ? ides[project.ide]?.color : '',
				  logo : project.ide && ides && ides[project.ide] ? ides[project.ide]?.logo : ''
			  });
		  const terminalLogo                                                    = useLogo(
			  {
				  type : ProgramType.terminal,
				  name : project.terminal && terminals && terminals[project.terminal] ? terminals[project.terminal].name : '',
				  color: project.terminal && terminals && terminals[project.terminal] ? terminals[project.terminal]?.color : '',
				  logo : project.terminal && terminals && terminals[project.terminal] ? terminals[project.terminal]?.logo : ''
			  });

		  function onDoubleClick() {
			  if (minimal) {

			  } else {
				  defaultAction(project.id);
			  }
		  }

		  function onClick() {
			  if (minimal) {
				  defaultAction(project.id);
			  } else {
				  if (selectProject) selectProject(project);
			  }
		  }

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
					  onDoubleClick={() => onDoubleClick()}
					  onClick={() => onClick()}
				  >
					  <Ripple />
					  <div>
						  {logo}
						  <div className='info'>
							  <div className='tp name' data-pr-tooltip={project.name}>{project.name}</div>
							  <div className='notDefaultElems'>
								  {project.ide ? <div className='tp ' data-pr-tooltip={ides && ides[project.ide]?.name}>{ideLogo}</div> : ''}
								  {project.terminal ? <div className='tp' data-pr-tooltip={terminals && terminals[project.terminal]?.name}>{terminalLogo}</div> : ''}
							  </div>
							  {minimal ? <pre className='path'>{project.path}</pre> : <LanguagesBar className='languageBar' stats={project.stats} />}
						  </div>
					  </div>
				  </li>
			  </div>
		  );
	  }
;

export default ProjectItem;
