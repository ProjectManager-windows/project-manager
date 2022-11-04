import '../../styles/Config.scss';
import { useTranslation }           from 'react-i18next';
import { ColorPicker }              from 'primereact/colorpicker';
import { InputText }                from 'primereact/inputtext';
import { Button }                   from 'primereact/button';
import SelectIde                    from '../ui/SelectIde';
import useCommit                    from '../hooks/useCommit';
import SelectTerminal               from '../ui/SelectTerminal';
import LanguagesBar                 from '../project/LanguagesBar';
import { ProgramType, ProjectType } from '../../../types/project';
import { MyAceEditor }              from '../ui/MyAceEditor';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-toml';
import 'ace-builds/src-noconflict/snippets/toml';

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
	const [env, setEnv, commitEnv, isChangedEnv]                                 = useCommit(selectedProject.env, (value) => {
		window.electron.projects.config(selectedProject.id, 'env', value);
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
			<div className='grid-table'>
				<div className='name-column'>
					{t('name').ucfirst()}
				</div>
				<div className='value-column'>
					<div className='p-inputgroup'>
						<InputText style={{ width: '100%' }} value={name || ''} onChange={e => setName(e.target.value)} onBlur={e => commitName(e.target.value)} />
						<span className='p-inputgroup-addon'>
 								<i className={`pi ${isChangedName ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							</span>
					</div>
				</div>
				<div className='name-column'>
					{t('description').ucfirst()}
				</div>
				<div className='value-column'>
					<div className='p-inputgroup'>
						<InputText style={{ width: '100%' }} value={description || ''} onChange={e => setDescription(e.target.value)} onBlur={e => commitDescription(e.target.value)} />
						<span className='p-inputgroup-addon'>
 								<i className={`pi ${isChangedDescription ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							</span>
					</div>
				</div>


				<div className='name-column'>
					{t('color').ucfirst()}
				</div>
				<div className='value-column'>
					<div style={{ width: '100%' }}>
						<div className='p-inputgroup'>
								<span className='p-inputgroup-addon'>
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
								</span>
								<InputText
									style={{ width: '100%' }} value={color} onChange={e => {
									setColor(`#${e.target.value.replaceAll('#', '')}`);
								}} onBlur={e => {
									commitColor(`#${e.target.value.replaceAll('#', '')}`);
								}}
								/>
							<span className='p-inputgroup-addon'>
									<i className={`pi ${isChangedColor ? 'pi-spin pi-spinner' : 'pi-check'}`} />
								</span>
						</div>
					</div>
				</div>


				<div className='name-column'>
					{t(ProgramType.ide)}
				</div>
				<div className='value-column'>
					<SelectIde id={selectedProject?.id} value={selectedProject?.ide} setVal={(v) => window.electron.projects.config(selectedProject.id, 'ide', v)} />
				</div>


				<div>
					{t(ProgramType.terminal)}
				</div>
				<div className='value-column'>
					<SelectTerminal id={selectedProject?.id} value={selectedProject?.terminal} setVal={(v) => window.electron.projects.config(selectedProject.id, ProgramType.terminal, v)} />
				</div>


				<div>
					{t('env').ucfirst()}
				</div>
				<div className='value-column'>
					<div className='p-inputgroup'>
						<MyAceEditor
							mode='toml'
							theme='monokai'
							value={env || ''}
							name='env-editor'
							height='100px'
							onChange={newValue => setEnv(newValue)}
							onBlur={(_e, editor) => commitEnv(editor?.getValue() || '')}
						/>
						<span className='p-inputgroup-addon'>
								<i className={`pi ${isChangedEnv ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							</span>
					</div>
				</div>


				<div className='name-column'>
					{t('logo').ucfirst()}
				</div>
				<div className='value-column logos-buttons'>
					<Button
						label={t('set logo').ucfirst()}
						style={{ width: 'calc(50% - 5px)' }}
						onClick={() => {
							window.electron.projects.changeLogo(selectedProject.id);
						}}
					/>
					<Button
						className='p-button-danger'
						label={t('remove logo').ucfirst()}
						style={{ width: 'calc(50% - 5px)' }}
						onClick={() => {
							window.electron.projects.removeLogo(selectedProject.id);
						}}
						disabled={!selectedProject.logo}
					/>
				</div>
			</div>
			<hr />
			<LanguagesBar className='languageBar' stats={selectedProject.stats} />
		</div>
	);
};

export default Config;
