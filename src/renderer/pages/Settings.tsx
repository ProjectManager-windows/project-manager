import '../styles/settings.scss';
import SettingInput    from '../components/ui/SettingInput';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
	let navigate = useNavigate();

	return (
		<div className='settings'>
			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left'></i>
			<div className='flex'>
				<SettingInput settingKey={'fs.blacklist'} type={'longText'} />
				<SettingInput settingKey={'test1'} type={'int'} />
				<SettingInput settingKey={'test2'} type={'float'} />
				<SettingInput settingKey={'test3'} type={'text'} />
				<SettingInput settingKey={'test4'} type={'switch'} />
				<SettingInput settingKey={'test5'} type={'select'} />
			</div>
		</div>
	);
};

export default Settings;
