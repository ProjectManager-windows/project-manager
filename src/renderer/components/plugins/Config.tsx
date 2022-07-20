import { Button }         from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ProjectType }    from '../../../types/project';
import SettingInput       from '../ui/SettingInput';
import SelectIde          from '../ui/SelectIde';
import '../../styles/Config.scss';

const Config = (props: { project: ProjectType }) => {
	const { project } = props;
	const { t }       = useTranslation();

	return (
		<div className='Config'>
			<div className='header'>
				<h3 className='name'>{project.name}</h3>
				<div className='description'>{project.description}</div>
			</div>
			<hr />
			<SettingInput value={project.name} settingKey='name' type='text' setVal={(v) => window.electron.projects.config(project.id, 'name', v)} />
			<SettingInput value={project.description} settingKey='description' type='longText' setVal={(v) => window.electron.projects.config(project.id, 'description', v)} />
			<SettingInput
				value={project.color} settingKey='color' type='color' setVal={(v) => {
				window.electron.projects.config(project.id, 'color', v);
			}}
			/>
			<SettingInput settingKey='ide' type='custom' value={project?.ide}>
				<SelectIde id={project?.id} value={project?.ide} setVal={(v) => window.electron.projects.config(project.id, 'ide', v)} />
			</SettingInput>
			<SettingInput settingKey='logo' type='custom' value={project?.logo}>
				<Button
					onClick={() => {
						window.electron.projects.changeLogo(project.id);
					}}
				>
					{t('logo')}
				</Button>
			</SettingInput>
		</div>
	);
};

export default Config;
