import '../styles/settings.scss';
import SettingInput    from '../components/ui/SettingInput';
import { useNavigate } from 'react-router-dom';
import { Tooltip }     from 'primereact/tooltip';

const Settings = () => {
	let navigate = useNavigate();

	return (
		<div className='settings'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />

			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left'></i>
			<div className='flex'>
				<SettingInput value={window.electron.settings.get('fs.blacklist')} settingKey={'fs.blacklist'} type={'text'} setVal={(e) => window.electron.settings.set('fs.blacklist', e)} />
				<SettingInput value={window.electron.settings.get('test1')} settingKey={'test1'} type={'int'} setVal={(e) => window.electron.settings.set('test1', e)} />
				<SettingInput value={window.electron.settings.get('test2')} settingKey={'test2'} type={'longText'} setVal={(e) => window.electron.settings.set('test2', e)} />
				<SettingInput value={window.electron.settings.get('test3')} settingKey={'test3'} type={'switch'} setVal={(e) => window.electron.settings.set('test2', e)} />
			</div>
		</div>
	);
};

export default Settings;
