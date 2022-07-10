import '../../styles/settings.scss';
import SettingInput from '../ui/SettingInput';

const Settings = () => {
	return (
		<div className='settings'>
			<div className='flex'>
				<SettingInput settingKey={'test'} type={'text'} />
				<SettingInput settingKey={'test2'} type={'int'} />
				<SettingInput settingKey={'test3'} type={'text'} />
			</div>
		</div>
	);
};

export default Settings;
