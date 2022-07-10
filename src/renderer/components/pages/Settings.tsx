import '../../styles/settings.scss';
import SettingInput from '../ui/SettingInput';

const Settings = () => {
	return (
		<div className='settings'>
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
