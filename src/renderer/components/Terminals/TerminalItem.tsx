import React       from 'react';
import { Ripple }  from 'primereact/ripple';
import '../../styles/TerminalItem.scss';
import { TerminalType } from '../../../types/project';
import useLogo     from '../hooks/useLogo';


const TerminalItem = (props: { terminal: TerminalType, onSelect: (e: React.MouseEvent<HTMLDivElement>, terminal: TerminalType) => void }) => {
	const { terminal, onSelect } = props;
	const logo                   = useLogo({
											   type : 'terminal',
											   name : terminal.name,
											   color: terminal?.color,
											   logo : terminal?.logo
										   });
	return (
		<div className='TerminalItem ' id={`terminal-item-${terminal.id}`} onClick={e => onSelect(e, terminal)}>
			<li className='item p-ripple' key={terminal.id}>
				<Ripple />
				<div>
					{logo}
					<div className='info'>
						<div className='tp name' data-pr-tooltip={terminal.name}>{terminal.name}</div>
					</div>
				</div>
			</li>
		</div>
	);
};

export default TerminalItem;
