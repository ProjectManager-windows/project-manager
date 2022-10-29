import '../styles/ides.scss';
import { useNavigate }                from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Tooltip }                    from 'primereact/tooltip';
import IdeList                        from '../components/Ides/IdeList';
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
			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left' />
			<IdeList Ides={ides} onSelect={select} />
			{selectedIde ?
			 <IdeEditor ide={selectedIde} />
						 :
			 <div className='IdeEditor' />}
		</div>
	);
};

export default Ides;
