import '../../styles/ProgramEditor.scss';
import { useTranslation }               from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { InputText }                    from 'primereact/inputtext';
import { Button }                       from 'primereact/button';
import { ListBox }                      from 'primereact/listbox';
import useCommit                        from '../hooks/useCommit';
import { ProgramFields }                from '../../../types/project';
import { MyAceEditor }                  from '../ui/MyAceEditor';
import { Help }                         from '../ui/Help';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/snippets/ejs';

const ProgramEditor = (props: { Program: ProgramFields, deleteProgram: (Program: ProgramFields) => void }) => {
	const { t }                                 = useTranslation();
	const { Program, deleteProgram }            = props;
	const [isDefaultProgram, setDefaultProgram] = useState(false);

	const [name, setName, commitName, isChangedName]                                         = useCommit(Program.name, (value) => {
		window.electron.programs.edit(Program.id, 'name', value);
	});
	const [label, setLabel, commitLabel, isChangedLabel]                                     = useCommit(Program.label, (value) => {
		window.electron.programs.edit(Program.id, 'label', value);
	});
	const [executeCommand, setExecuteCommand, commitExecuteCommand, isChangedExecuteCommand] = useCommit(Program.executeCommand, (value) => {
		window.electron.programs.edit(Program.id, 'executeCommand', value);
	});
	const commandVars                                                                        = useMemo(() => {
		const data = window.electron.programs.getCommandVars(Program.id);
		const keys = Object.keys(data).sort((a, b) => {
			if (a.startsWith('PROGRAM_') || a.startsWith('PROJECT_') && (!b.startsWith('PROGRAM_') && !b.startsWith('PROJECT_'))) {
				return -1;
			}
			if (b.startsWith('PROGRAM_') || b.startsWith('PROJECT_') && (!a.startsWith('PROGRAM_') && !a.startsWith('PROJECT_'))) {
				return 1;
			}
			return a[0].localeCompare(b[0]);

		});
		keys.filter((key) => {
			return !key.startsWith('npm_');
		});
		keys.map((key) => {
			return { name: t(key), value: key };
		});
		return keys;
	}, [Program.id, t]);


	useEffect(() => {
		const def = parseInt(window.electron.settings.get<string>(`default.${Program.type}`), 10);
		if (def === parseInt(String(Program.id), 10)) {
			setDefaultProgram(true);
		} else {
			setDefaultProgram(false);
		}
	}, [Program]);

	return (
		<div className={`ProgramEditor ${Program.name}`}>
			<div className='header'>
				<h3 className='name'>[{t(Program.type).ucfirst()}] {Program.label}</h3>
				<div className='description'>{Program.executePath}</div>
			</div>
			<hr />
			<div className='grid-table'>
				<div className='name-column'>
					{t('name')}
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
					{t('label')}
				</div>
				<div className='value-column'>
					<div className='p-inputgroup'>
						<InputText style={{ width: '100%' }} value={label || ''} onChange={e => setLabel(e.target.value)} onBlur={e => commitLabel(e.target.value)} />
						<span className='p-inputgroup-addon'>
								<i className={`pi ${isChangedLabel ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							</span>
					</div>
				</div>
				<div className='name-column'>
					{t('executeCommand')}
				</div>
				<div className='value-column'>
					<div className='p-inputgroup'>
						<MyAceEditor
							mode='ejs'
							theme='monokai'
							name='command-editor'
							height='100px'
							onChange={newValue => setExecuteCommand(newValue)}
							onBlur={(_e, editor) => commitExecuteCommand(editor?.getValue() || '')}
							value={executeCommand || ''}
						/>
						<span className='p-inputgroup-addon'>
								<Help label='?'>
									<ListBox
										options={commandVars} onChange={(e) => {
										setExecuteCommand(`${executeCommand}<%-${e.value}%>`);
									}}
									/>
								</Help>
							</span>
						<span className='p-inputgroup-addon'>
								<i className={`pi ${isChangedExecuteCommand ? 'pi-spin pi-spinner' : 'pi-check'}`} />
							</span>
					</div>
				</div>
				<div className='name-column'>
					{t('set default')}
				</div>
				<div className='value-column'>
					<Button
						label={t('set as default').ucfirst()}
						disabled={isDefaultProgram} onClick={() => {
						window.electron.settings.set(`default.${Program.type}`, Program.id);
						setDefaultProgram(true);
					}}
					/>
				</div>
				<div className='name-column'>
					{t('delete')}
				</div>
				<div className='value-column'>
					<Button
						className='p-button-danger'
						label={t('delete').ucfirst()}
						onClick={() => deleteProgram(Program)}
					/>
				</div>
			</div>

		</div>
	);

};

export default ProgramEditor;
