import { ProjectType } from '../../../types/project';
import SettingInput    from '../ui/SettingInput';
import gear            from '../../../../assets/icons/svg/gear.svg';
import useLogo         from '../hooks/useLogo';
import SelectIde       from '../ui/SelectIde';
import { Button }      from 'react-bootstrap';

const Config = (props: { project: ProjectType }) => {
	const { project } = props;
	const techLogo    = useLogo({
									type : 'technology',
									name : 'config',
									logo : gear,
									color: '#FFFFFF'
								});
	const projectLogo = useLogo({
									type : 'project',
									name : project.name,
									logo : project.logo,
									color: project.color
								});
	return (
		<div>
			<div className='header'>
				{techLogo}
				<div>
					{'-'}
				</div>
				{projectLogo}
			</div>
			<br />
			<SettingInput value={project.name} settingKey='name' type='text' setVal={(v) => window.electron.projects.config(project.id, 'name', v)} />
			<SettingInput
				value={project.color} settingKey='color' type='color' setVal={(v) => {
				window.electron.projects.config(project.id, 'color', v);
			}}
			/>
			<SettingInput settingKey='ide' type='select' value={project?.ide}>
				<SelectIde id={project?.id} value={project?.ide} setVal={(v) => window.electron.projects.config(project.id, 'ide', v)} />
			</SettingInput>
			<Button
				onClick={() => {
					window.electron.projects.changeLogo(project.id);
				}}
			/>
		</div>
	);
};

export default Config;
