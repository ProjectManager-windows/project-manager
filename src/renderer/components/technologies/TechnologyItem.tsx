import '../../styles/TechnologyItem.scss';
import { Ripple }         from 'primereact/ripple';
import { useTranslation } from 'react-i18next';
import useLogo            from '../hooks/useLogo';

const TechnologyItem = (props: { active: boolean, onSelect: (name: string) => void, name: string, icon?: string, color?: string }) => {
	const { t } = useTranslation();

	let { color, icon, name, onSelect, active } = props;
	const logo                                  = useLogo({
															  type : 'technology',
															  name : name,
															  color: color,
															  logo : icon
														  });
	console.log(active)
	return (
		<div className='TechnologyItem ' id={`technology-item-${name}`} onClick={() => onSelect(name)}>
			<li className={`item p-ripple ${active ? 'active' : ''}`} key={name}>
				<Ripple />
				<div>
					{logo}
					<div className='info'>
						<div className='tp name' data-pr-tooltip={name}>{t(name)}</div>
					</div>
				</div>
			</li>
		</div>
	);
};

export default TechnologyItem;
