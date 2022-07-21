import '../../styles/TechnologiesList.scss';
import { useContext, useEffect } from 'react';
import TechnologyItem            from './TechnologyItem';
import gear                      from '../../../../assets/icons/svg/gear.svg';
import Config                    from '../plugins/Config';
import { ProjectContext }        from '../context/ProjectContext';

const TechnologiesList = () => {
	const { selectedProject, technology, setTechnology, setView } = useContext(ProjectContext);
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
			if (setView) setView(element);
		}
	}, [selectedProject, technology]);
	const select = (name: string) => {
		if (setTechnology) setTechnology(name);
	};
	if (selectedProject) {
		return (
			<div className='TechnologiesList'>
				<ul className='list'>
					<TechnologyItem active={technology === 'config'} onSelect={select} name={'config'} icon={gear} color='#ffffff'></TechnologyItem>
				</ul>
			</div>
		);
	}
	return (
		<div className='TechnologiesList'>
			<ul className='list'/>
		</div>
	);
};

export default TechnologiesList;
