import '../../styles/TechnologyItem.scss';
import { Ripple } from 'primereact/ripple';
import useLogo    from '../hooks/useLogo';

const TechnologyItem = (props: { active: boolean, onSelect: (name: string) => void, name: string, label?: string | undefined, icon?: string, color?: string }) => {
	let { color, icon, name, onSelect, active, label } = props;
	const logo                                         = useLogo({
																	 type : 'technology',
																	 name : name,
																	 color: color,
																	 logo : icon
																 });
	return (
		<div className='TechnologyItem ' id={`technology-item-${name}`} onClick={() => onSelect(name)}>
			<li className={`item p-ripple ${active ? 'active' : ''}`} key={name}>
				<Ripple />
				<div>
					{logo}
					<div className='info'>
						<div className='tp name' data-pr-tooltip={name}>{label ?? name}</div>
					</div>
				</div>
			</li>
		</div>
	);
};

export default TechnologyItem;
