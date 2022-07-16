import '../styles/ides.scss';
import { useNavigate }                from 'react-router-dom';
import IdeList                        from '../components/Ides/IdeList';
import React, { useEffect, useState } from 'react';
import { Tooltip }                    from 'primereact/tooltip';
import { IDEType }                    from '../../types/project';
import IdeEditor                      from '../components/Ides/IdeEditor';

const Ides = () => {
	let navigate                   = useNavigate();
	const [ides, setIdes]          = useState(window.electron.ides.getAll());
	const [selectedIde, selectIde] = useState<IDEType>();
	useEffect(() => {
		return window.electron.ides.onUpdate(() => {
			setIdes(window.electron.ides.getAll());
		});
	}, []);
	const select = (e: React.MouseEvent<HTMLDivElement>, ide: IDEType) => {
		e.preventDefault();
		selectIde(ide);
	};
	return (
		<div className='Ides'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left'></i>
			<IdeList Ides={ides} onSelect={select}></IdeList>
			<IdeEditor ide={selectedIde} />
		</div>
	);
};

export default Ides;
