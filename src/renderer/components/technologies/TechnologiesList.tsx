import '../../styles/TechnologiesList.scss';
import { ProjectType }         from 'types/project';
import { useEffect, useState } from 'react';
import TechnologyItem          from './TechnologyItem';
import gear                    from '../../../../assets/icons/svg/gear.svg';

const TechnologiesList = (props: { selectedProject?: ProjectType, onSelect: (element: JSX.Element) => void }) => {
	const { selectedProject, onSelect } = props;
	const [technology, setTechnology]   = useState('');

	if (selectedProject) {
		console.log(selectedProject);
	}
	useEffect(() => {
		const element = (<h1>{technology} - {selectedProject?.name}</h1>);
		if (selectedProject && technology) {

			onSelect(element);
		}
	}, [selectedProject, technology]);

	const select = (name: string) => {
		setTechnology(name);
	};

	return (
		<div className='TechnologiesList'>
			<ul className='list'>
				<TechnologyItem onSelect={select} name={'test2'} icon={gear} color="#ffffff"></TechnologyItem>
			</ul>
		</div>
	)
		;
};

export default TechnologiesList;
