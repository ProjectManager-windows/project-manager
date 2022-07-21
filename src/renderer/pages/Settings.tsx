import '../styles/settings.scss';
import { useNavigate } from 'react-router-dom';
import { Tooltip }     from 'primereact/tooltip';

const Settings = () => {
	let navigate = useNavigate();

	return (
		<div className='settings'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />

			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left'></i>
			<div className='flex'>

			</div>
		</div>
	);
};

export default Settings;
