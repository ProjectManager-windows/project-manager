import '../../styles/technologies/TechnologyItem.scss';
import { Ripple } from 'primereact/ripple';
import useLogo    from '../hooks/useLogo';

const TechnologyItem = (props: { disabled?: boolean, active: boolean, onSelect: (name: string) => void, name: string, label?: string | undefined, icon?: string, color?: string }) => {
	let { color, icon, name, onSelect, active, label, disabled } = props;
	const logo                                                   = useLogo({
																			   type: 'technology',
																			   name: name,
																			   color: color,
																			   logo: icon
																		   });
	return (
		<div data-disabled={disabled}
			className='TechnologyItem' id={`technology-item-${name}`} onClick={() => {
			if (!disabled) onSelect(name);
		}}
		>
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
