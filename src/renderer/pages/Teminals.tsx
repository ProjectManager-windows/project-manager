import '../styles/Terminals.scss';
import { useNavigate }                from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Tooltip }                    from 'primereact/tooltip';
import TerminalList                   from '../components/Terminals/TerminalList';
import { IDEType }                    from '../../types/project';
import TerminalEditor                 from '../components/Terminals/TerminalEditor';

const Terminals = () => {
	const navigate                           = useNavigate();
	const [ides, setTerminals]               = useState(window.electron.terminals.getAll());
	const [selectedTerminal, selectTerminal] = useState<IDEType>();
	useEffect(() => {
		return window.electron.terminals.onUpdate(() => {
			setTerminals(window.electron.ides.getAll());
		});
	}, []);
	const select = (e: React.MouseEvent<HTMLDivElement>, ide: IDEType) => {
		e.preventDefault();
		selectTerminal(ide);
	};
	return (
		<div className='Terminals'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left' />
			<TerminalList Terminals={ides} onSelect={select} />
			<TerminalEditor terminal={selectedTerminal} />
		</div>
	);
};

export default Terminals;
