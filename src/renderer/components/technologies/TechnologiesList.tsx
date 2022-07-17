import '../../styles/TechnologiesList.scss';
import { ProjectType }         from 'types/project';
import { useEffect, useState } from 'react';
import TechnologyItem          from './TechnologyItem';
import gear   from '../../../../assets/icons/svg/gear.svg';
import Config from '../plugins/Config';

const TechnologiesList = (props: { selectedProject?: ProjectType, onSelect: (element: JSX.Element) => void }) => {
	const { selectedProject, onSelect } = props;
	const [technology, setTechnology]   = useState('');

	if (selectedProject) {
	}
	useEffect(() => {
		if (selectedProject && technology) {
			let element = (<h1>{technology} - {selectedProject?.name}</h1>);
			switch (technology) {
				case 'config':
					element = (<Config project={selectedProject} />);
					break;
				default:
					break;
			}
			onSelect(element);
		}
	}, [selectedProject, technology]);

	const select = (name: string) => {
		setTechnology(name);
	};

	return (
		<div className='TechnologiesList'>
			<ul className='list'>
				<TechnologyItem onSelect={select} name={'config'} icon={gear} color='#ffffff'></TechnologyItem>
			</ul>
		</div>
	)
		;
};

export default TechnologiesList;
