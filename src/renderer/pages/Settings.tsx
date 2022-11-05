import '../styles/settings.scss';
import { useNavigate }    from 'react-router-dom';
import { Tooltip }        from 'primereact/tooltip';
import { ChooseLanguage } from '../components/settings/ChooseLanguage';
// import { useTranslation } from 'react-i18next';

const Settings = () => {
	let navigate = useNavigate();
	// const { t }  = useTranslation();

	return (
		<div className='settings'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />

			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left'></i>
			<div className='flex'>
				<ChooseLanguage />
			</div>
		</div>
	);
};

export default Settings;
