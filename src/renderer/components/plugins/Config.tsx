import '../../styles/Config.scss';
import { useTranslation } from 'react-i18next';
import { ColorPicker }    from 'primereact/colorpicker';
import { InputText }      from 'primereact/inputtext';
import SelectIde          from '../ui/SelectIde';
import useCommit          from '../hooks/useCommit';
import SelectTerminal     from '../ui/SelectTerminal';
import LanguagesBar                 from '../project/LanguagesBar';
import { ProgramType, ProjectType } from '../../../types/project';
import { Button }                   from 'primereact/button';

const Config = (props: { selectedProject: ProjectType }) => {
	const { selectedProject }                                                    = props;
	const { t }                                                                  = useTranslation();
	const [name, setName, commitName, isChangedName]                             = useCommit(selectedProject.name, (value) => {
		window.electron.projects.config(selectedProject.id, 'name', value);

	});
	const [description, setDescription, commitDescription, isChangedDescription] = useCommit(selectedProject.description, (value) => {
		window.electron.projects.config(selectedProject.id, 'description', value);
	});
	const [color, setColor, commitColor, isChangedColor]                         = useCommit(selectedProject.color, (value) => {
		window.electron.projects.config(selectedProject.id, 'color', value);
	});
	if (!selectedProject) {
		return <></>;
	}
	return (
		<div className='Config'>
			<div className='header'>
				<h3 className='name'>{selectedProject.name}</h3>
				<div className='description'>{selectedProject.description}</div>
			</div>
			<hr />
			<table>
				<thead />
				<tbody>
				<tr>
					<td className='name-column'>
						{t('name')}
					</td>
					<td className='value-column'>
						 <span className='p-input-icon-right'>
                    		<i className={`pi ${isChangedName ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							<InputText style={{ width: '100%' }} value={name || ''} onChange={e => setName(e.target.value)} onBlur={e => commitName(e.target.value)} />
						 </span>
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t('description')}
					</td>
					<td className='value-column'>
						 <span className='p-input-icon-right'>
                    		<i className={`pi ${isChangedDescription ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							<InputText style={{ width: '100%' }} value={description || ''} onChange={e => setDescription(e.target.value)} onBlur={e => commitDescription(e.target.value)} />
						</span>
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t('color')}
					</td>
					<td className='value-column'>
						<div style={{ width: '100%' }}>
							<ColorPicker
								style={{ width: '35px' }}
								value={color}
								onChange={e => {
									if (typeof e.value === 'string') {
										setColor(`#${String(e.value).replaceAll('#', '')}`);
									}
								}}
								onMouseUp={() => commitColor()}
							/>
							<span
								className='p-input-icon-right' style={{ width: 'calc(100% - 70px)' }}
							>
                    			<i className={`pi ${isChangedColor ? 'pi-spin pi-spinner' : 'pi-check'}`} />
								<InputText
									style={{ width: '100%' }}
									value={color}
									onChange={e => {
										setColor(`#${e.target.value.replaceAll('#', '')}`);
									}}
									onBlur={e => {
										commitColor(`#${e.target.value.replaceAll('#', '')}`);
									}}
								/>
							</span>
						</div>
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t(ProgramType.ide)}
					</td>
					<td className='value-column'>
						<SelectIde id={selectedProject?.id} value={selectedProject?.ide} setVal={(v) => window.electron.projects.config(selectedProject.id, 'ide', v)} />
					</td>
				</tr>
				<tr>
					<td>
						{t('terminal')}
					</td>
					<td className='value-column'>
						<SelectTerminal id={selectedProject?.id} value={selectedProject?.terminal} setVal={(v) => window.electron.projects.config(selectedProject.id, 'terminal', v)} />
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t('logo')}
					</td>
					<td className='value-column logos-buttons'>
						<Button
							label={t('set logo')}
							style={{ width: 'calc(50% - 5px)' }}
							onClick={() => {
								window.electron.projects.changeLogo(selectedProject.id);
							}}
						>
						</Button>
						<Button
							className={'p-button-danger'}
							label={t('remove logo')}
							style={{ width: 'calc(50% - 5px)' }}
							onClick={() => {
								window.electron.projects.removeLogo(selectedProject.id);
							}}
							disabled={!selectedProject.logo}
						>
						</Button>
					</td>
				</tr>

				</tbody>
			</table>
			<hr />
			<LanguagesBar className='languageBar' stats={selectedProject.stats} />
		</div>
	);
};

export default Config;
