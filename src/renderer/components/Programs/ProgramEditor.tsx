import '../../styles/programs/ProgramEditor.scss';
import { useTranslation }               from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { InputText }                    from 'primereact/inputtext';
import { Button }                       from 'primereact/button';
import useCommit                        from '../hooks/useCommit';
import { ProgramFields }                from '../../../types/project';
import { MyAceEditor }                  from '../ui/MyAceEditor';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/snippets/ejs';
import { Dialog }                       from 'primereact/dialog';
import { ListBox }                      from 'primereact/listbox';
import { Help }                         from '../ui/Help';
import { Ace }                          from 'ace-builds';
import { Splitter, SplitterPanel }      from 'primereact/splitter';
import { Dropdown }                     from 'primereact/dropdown';
import { FontAwesomeIcon }              from '@fortawesome/react-fontawesome';
import { faBug }                        from '@fortawesome/free-solid-svg-icons';

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
	const [displayMaximizable, setDisplayMaximizable]                                        = useState(false);
	const [ace, setAce]                                                                      = useState<Ace.Editor | null>(null);

	useEffect(() => {
		const def = parseInt(window.electron.settings.get<string>(`default.${Program.type}`), 10);
		if (def === parseInt(String(Program.id), 10)) {
			setDefaultProgram(true);
		} else {
			setDefaultProgram(false);
		}
	}, [Program]);
	const editor = <MyAceEditor
		mode='ejs'
		onLoad={(e) => setAce(e)}
		theme='monokai'
		name='command-editor'
		height=''
		width='10000px'
		onChange={newValue => setExecuteCommand(newValue)}
		onBlur={(_e, editor) => commitExecuteCommand(editor?.getValue() || '')}
		value={executeCommand || ''}
	/>;
	const header = <>
		{t('execute command').ucfirst()} <i className={`pi ${isChangedExecuteCommand ? 'pi-spin pi-spinner' : 'pi-check'}`} />
	</>;
	const footer = <>
		<Help label='?'>
			<ListBox
				options={commandVars} onChange={(e) => {
				if (ace) {
					const pos = ace.selection.getCursor();
					const end = ace.session.insert(pos, `<%-${e.value}%>`);
					// @ts-ignore
					ace.selection.setRange({ start: pos, end: end });
				} else {
					setExecuteCommand(`${executeCommand}<%-${e.value}%>`);
				}
			}}
			/>
		</Help>
	</>;

	//DEBUGGER
	const [projects]                      = useState(Object.values(window.electron.projects.getAll()));
	const [debugProject, setDebugProject] = useState<number>(0);
	const [debugResult, setDebugResult]   = useState<{ errors: string[], commands: string[] }>({ commands: [], errors: [] });

	async function Debug() {
		console.log(debugProject);
		if (debugProject) {
			const resp: { errors: string[], commands: string[] } = await window.electron.programs.CommandDebug(Program.id, debugProject);
			console.log(resp);
			setDebugResult(resp);
		} else {
			setDebugResult({ commands: [], errors: [t('Error not project')] });
		}
	}
	useEffect(()=>{
		setDebugResult({ commands: [], errors: [] });
	},[debugProject])

	return (
		<div className={`ProgramEditor ${Program.name}`}>
			<div className='header'>
				<h3 className='name'>[{t(Program.type).ucfirst()}] {Program.label}</h3>
				<div className='description'>{Program.executePath}</div>
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
					{t('label').ucfirst()}
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
					{t('execute command').ucfirst()}
				</div>
				<div className='value-column'>
					<div className='p-inputgroup' style={{ height: '100px' }}>
						{editor}
						<span className='p-inputgroup-addon'>
							<Button icon='pi pi-pencil' onClick={() => setDisplayMaximizable(true)} />
						</span>
						<span className='p-inputgroup-addon'>
							<i className={`pi ${isChangedExecuteCommand ? 'pi-spin pi-spinner' : 'pi-check'}`} />
						</span>
					</div>
				</div>
				<div className='name-column'>
					{t('set as default').ucfirst()}
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
			<Dialog header={header} footer={footer} visible={displayMaximizable} maximizable modal style={{ width: '50vw', height: '50vw' }} onHide={() => setDisplayMaximizable(false)}>
				<Splitter style={{ height: '100%' }} layout='vertical'>
					<SplitterPanel size={50} minSize={20}>
						<div style={{ display: 'flex', height: '100%' }}>
							{editor}
						</div>
					</SplitterPanel>
					<SplitterPanel size={50} minSize={20}>
						<div className='p-inputgroup'>
							<Dropdown
								value={debugProject} filter showClear filterBy='name' placeholder={t('debug with ...').ucfirst()} optionValue='id' options={projects}
								onChange={(e) => setDebugProject(e.value)} optionLabel='name'
							/>
							<span className='p-inputgroup-addon'>
								<Button icon={<FontAwesomeIcon icon={faBug} />} onClick={Debug} />
							</span>
						</div>
						<div>
							{debugResult?.errors?.map((cmd) => <div key={cmd} className='err alert alert-danger'>{cmd}</div>)}
							{debugResult?.commands?.map((cmd) => <div key={cmd} className='cmd alert alert-success'>{cmd}</div>)}
						</div>
					</SplitterPanel>
				</Splitter>
			</Dialog>
		</div>
	);

};

export default ProgramEditor;
