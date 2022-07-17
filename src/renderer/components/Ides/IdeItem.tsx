import React       from 'react';
import { Ripple }  from 'primereact/ripple';
import '../../styles/IdeItem.scss';
import { IDEType } from '../../../types/project';
import useLogo     from '../hooks/useLogo';


const IdeItem = (props: { Ide: IDEType, onSelect: (e: React.MouseEvent<HTMLDivElement>, Ide: IDEType) => void }) => {
	const { Ide, onSelect } = props;
	const logo              = useLogo({
										  type : 'ide',
										  name : Ide.name,
										  color: Ide?.color,
										  logo : Ide?.logo,
									  });
	return (
		<div className='IdeItem ' id={`Ide-item-${Ide.id}`} onClick={e => onSelect(e, Ide)}>
			<li className='item p-ripple' key={Ide.id}>
				<Ripple />
				<div>
					{logo}
					<div className='info'>
						<div className='tp name' data-pr-tooltip={Ide.name}>{Ide.name}</div>
					</div>
				</div>
			</li>
		</div>
	);
};

export default IdeItem;
