import React, { MouseEvent } from 'react';
import { Ripple }            from 'primereact/ripple';
import { ProjectType }       from '../../../types/project';
import LanguagesBar          from './LanguagesBar';
import '../../styles/projectItem.scss';
import useLogo               from '../hooks/useLogo';


const ProjectItem = (props: { project: ProjectType, onSelect: (e: React.MouseEvent<HTMLDivElement>, project: ProjectType) => void }) => {
	const { project, onSelect } = props;
	const defaultAction         = (_e: MouseEvent) => {
		window.electron.projects.open(project.id);
	};
	const logo                  = useLogo({
											  type : 'project',
											  name : project.name,
											  color: project?.color,
											  logo : project?.logo
										  });
	return (
		<div className='projectItem ' id={`project-item-${project.id}`} onDoubleClick={e => defaultAction(e)} onClick={e => onSelect(e, project)}>
			<li className='item p-ripple' key={project.id}>
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
};

export default ProjectItem;
