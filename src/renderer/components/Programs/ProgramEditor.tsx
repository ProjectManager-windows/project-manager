import { useTranslation } from 'react-i18next';
import { useState }       from 'react';
import '../../styles/ProgramEditor.scss';
import { ProgramFields }  from '../../../types/project';
import useCommit          from '../hooks/useCommit';
import { InputText }      from 'primereact/inputtext';
import { Button }         from 'primereact/button';
import { InputTextarea }  from 'primereact/inputtextarea';


const ProgramEditor = (props: { Program: ProgramFields }) => {
	const { t }                                 = useTranslation();
	const { Program }                           = props;
	const [isDefaultProgram, setDefaultProgram] = useState(false);

	const [name, setName, commitName, isChangedName]     = useCommit(Program.name, (value) => {
		window.electron.programs.edit(Program.id, 'name', value);
	});
	const [label, setLabel, commitLabel, isChangedLabel] = useCommit(Program.label, (value) => {
		window.electron.programs.edit(Program.id, 'label', value);
	});
	const [executeCommand, setExecuteCommand, commitExecuteCommand, isChangedExecuteCommand] = useCommit(Program.executeCommand, (value) => {
		window.electron.programs.edit(Program.id, 'executeCommand', value);
	});
	return (
		<div className={`ProgramEditor ${Program.name}`}>
			<div className='header'>
				<h3 className='name'>[{Program.type}] {Program.label}</h3>
				<div className='description'>{Program.executePath}</div>
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
						{t('label')}
					</td>
					<td className='value-column'>
						 <span className='p-input-icon-right'>
                    		<i className={`pi ${isChangedLabel ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							<InputText style={{ width: '100%' }} value={label || ''} onChange={e => setLabel(e.target.value)} onBlur={e => commitLabel(e.target.value)} />
						 </span>
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t('executeCommand')}
					</td>
					<td className='value-column'>
						 <span className='p-input-icon-right'>
                    		<i className={`pi ${isChangedExecuteCommand ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							<InputTextarea  style={{ width: '100%' }} value={executeCommand || ''} onChange={e => setExecuteCommand(e.target.value)} onBlur={e => commitExecuteCommand(e.target.value)} />
						 </span>
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t('set default')}
					</td>
					<td className='value-column'>
						<Button
							label={t('set as default').ucfirst()}
							disabled={isDefaultProgram} onClick={() => {
							window.electron.settings.set('defaultProgram', Program.id);
							setDefaultProgram(true);
						}}
						></Button>
					</td>
				</tr>
				<tr>
					<td className='name-column'>
						{t('delete')}
					</td>
					<td className='value-column'>
						<Button
							className={'p-button-danger'}
							label={t('delete').ucfirst()}
							onClick={() => {
								window.electron.programs.delete(Program.id);
							}}
						></Button>
					</td>
				</tr>
				</tbody>
			</table>

		</div>
	);

};

export default ProgramEditor;
