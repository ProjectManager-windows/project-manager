import '../../styles/TechnologiesList.scss';
import { useContext, useEffect, useMemo } from 'react';
import TechnologyItem                     from './TechnologyItem';
import Config                             from '../plugins/Config';
import { ProjectContext }                 from '../context/ProjectContext';
import { faGear, faGears }                from '@fortawesome/free-solid-svg-icons';
import useFaIcon                          from '../hooks/useFaIcon';
import { useTranslation }                 from 'react-i18next';
import BatchManagement                    from '../plugins/BatchManagement';

const TechnologiesList = () => {
	const { t }                                                   = useTranslation();
	const { selectedProject, technology, setTechnology, setView } = useContext(ProjectContext);
	useEffect(() => {
		if (technology) {
			let element = (<h1>{technology}</h1>);
			switch (technology) {
				case 'config':
					if (selectedProject) element = (<Config selectedProject={selectedProject} />);
					break;
				case 'BatchManagement':
					element = (<BatchManagement />);
					break;
				default:
					break;
			}
			if (setView) setView(element);
		}
	}, [selectedProject, setView, technology]);
	const select   = (name: string) => {
		if (setTechnology) setTechnology(name);
	};
	const faGears2 = useFaIcon(faGears);
	const faGear2  = useFaIcon(faGear);
	const list     = useMemo(() => {
		const list = [];
		list.push(<TechnologyItem name={'BatchManagement'} key={'BatchManagement'} active={technology === 'BatchManagement'} onSelect={select} label={t('batch management').ucfirst()} icon={faGears2} color='#ffffff'/>);
		list.push(<TechnologyItem disabled={!selectedProject} name={'config'} key={'config'} active={technology === 'config'} onSelect={select} label={t('config').ucfirst()} icon={faGear2} color='#ffffff' />);
		return list;
	}, [selectedProject,technology]);
	return (
		<div className='TechnologiesList'>
			<ul className='list'>
				{list.map(i => i)}
			</ul>
		</div>
	);
};

export default TechnologiesList;
