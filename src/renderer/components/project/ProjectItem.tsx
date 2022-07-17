import React           from 'react';
import { Ripple }      from 'primereact/ripple';
import { ProjectType } from '../../../types/project';
import LanguagesBar    from './LanguagesBar';
import useLogo         from '../hooks/useLogo';
import '../../styles/projectItem.scss';

const ProjectItem = (props: { project: ProjectType, onSelect: (e: React.MouseEvent<HTMLElement>, project: ProjectType) => void, cm: React.MutableRefObject<any>, defaultAction: (id: number) => void }) => {
	const { project, onSelect, cm, defaultAction } = props;
	const logo                                     = useLogo(
		{
			type : 'project',
			name : project.name,
			color: project?.color,
			logo : project?.logo
		});
	return (
		<div className='projectItem ' id={`project-item-${project.id}`}>
			<li
				className='item p-ripple' key={project.id}
				onContextMenu={(e) => {
					onSelect(e, project);
					cm.current.show(e);
				}}
				onDoubleClick={() => defaultAction(project.id)}
				onClick={e => onSelect(e, project)}
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
};

export default ProjectItem;
