import '../../styles/projectList.scss';
import ProjectItem     from './ProjectItem';
import React           from 'react';
import { ProjectType } from '../../../types/project';

const ProjectList = (props: { projects: { [key: string]: any }, onSelect: (e: React.MouseEvent<HTMLDivElement>, ide: ProjectType) => void }) => {
		  const { projects, onSelect } = props;
		  let forSort                  = [];
		  const list                   = [];

		  // eslint-disable-next-line guard-for-in
		  for (const projectsKey in projects) {
			  const project = projects[projectsKey];
			  forSort.push(project);
		  }
		  forSort = forSort.sort((a, b) => {
			  return a.name.localeCompare(b.name);
		  });
		  for (const project of forSort) {
			  list.push(<ProjectItem onSelect={(e, project) => onSelect(e, project)} key={project.id} project={project} />);
		  }
		  return (
			  <div className='ProjectList'>
				  <ul className='list'>
					  {list}
				  </ul>
			  </div>
		  );
	  }
;

export default ProjectList;
