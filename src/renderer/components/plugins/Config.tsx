import { Button }         from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ColorPicker }    from 'primereact/colorpicker';
import { InputText }      from 'primereact/inputtext';
import { useContext }     from 'react';
import SelectIde          from '../ui/SelectIde';
import useCommit          from '../hooks/useCommit';
import '../../styles/Config.scss';
import { ProjectContext } from '../context/ProjectContext';
import SelectTerminal     from '../ui/SelectTerminal';

const Config = () => {
	const { selectedProject }                                                    = useContext(ProjectContext);
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

	return (
		<div className='Config'>
			<div className='header'>
				<h3 className='name'>{selectedProject.name}</h3>
				<div className='description'>{selectedProject.description}</div>
			</div>
			<hr />
			<table>
				<colgroup>
					<col style={{ width: '50%' }} />
					<col style={{ width: '50%' }} />
				</colgroup>
				<thead />
				<tbody>
				<tr>
					<td>
						{t('name')}
					</td>
					<td>
						 <span className='p-input-icon-right'>
                    		<i className={`pi ${isChangedName ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							<InputText style={{ width: '100%' }} value={name || ''} onChange={e => setName(e.target.value)} onBlur={e => commitName(e.target.value)} />
						 </span>
					</td>
				</tr>
				<tr>
					<td>
						{t('description')}
					</td>
					<td>
						 <span className='p-input-icon-right'>
                    		<i className={`pi ${isChangedDescription ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							<InputText style={{ width: '100%' }} value={description || ''} onChange={e => setDescription(e.target.value)} onBlur={e => commitDescription(e.target.value)} />
						</span>
					</td>
				</tr>
				<tr>
					<td>
						{t('color')}
					</td>
					<td>
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
					<td>
						{t('ide')}
					</td>
					<td>
						<SelectIde id={selectedProject?.id} value={selectedProject?.ide} setVal={(v) => window.electron.projects.config(selectedProject.id, 'ide', v)} />
					</td>
				</tr>
				<tr>
					<td>
						{t('terminal')}
					</td>
					<td>
						<SelectTerminal id={selectedProject?.id} value={selectedProject?.terminal} setVal={(v) => window.electron.projects.config(selectedProject.id, 'terminal', v)} />
					</td>
				</tr>
				<tr>
					<td>
						{t('logo')}
					</td>
					<td>
						<Button
							style={{ width: 'calc(100% - 35px)' }}
							onClick={() => {
								window.electron.projects.changeLogo(selectedProject.id);
							}}
						>
							{t('logo')}
						</Button>
					</td>
				</tr>

				</tbody>
			</table>
		</div>
	);
};

export default Config;
