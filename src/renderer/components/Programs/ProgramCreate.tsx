import { Dropdown }            from 'primereact/dropdown';
import { useTranslation }      from 'react-i18next';
import '../../styles/ProgramEditor.scss';
import { ReactNode, useState } from 'react';
import { Button }              from 'react-bootstrap';
import { ProgramType }         from '../../../types/project';

const ProgramEditor = () => {
	const { t }           = useTranslation();
	const [type, setType] = useState<ProgramType>();
	const [path, setPath] = useState<string>('');
	const [btn, setBtn]   = useState<string | ReactNode>(t('choose file').ucfirst());

	const cities     = [
		{ name: t(ProgramType.other).ucfirst(), code: ProgramType.other },
		{ name: t(ProgramType.ide).ucfirst(), code: ProgramType.ide },
		{ name: t(ProgramType.terminal).ucfirst(), code: ProgramType.terminal }
	];
	const chooseFile = () => {
		const p = window.electron.inputFile();
		setPath(p);
		if (p) {
			setBtn(<span style={{ opacity: 0.5 }}>{window.electron.path.basename(p)}</span>);
		} else {
			setBtn(t('choose file').ucfirst());
		}
	};

	const create = () => {
		if (!type) return;
		if (!path) return;
		window.electron.programs.create({ type: type, path: path });
	};
	return <div className='ProgramEditor'>
		<h4>{t('create').ucfirst()}</h4>
		<hr />
		<ul>
			<li className='value-column'>
				<Dropdown style={{ width: '100%' }} value={type} options={cities} onChange={e => setType(e.value.code)} optionLabel='name' />
			</li>
			<li className='value-column'>
				<Button style={{ width: '100%' }} disabled={!type} onClick={chooseFile}>{btn}</Button>
			</li>
			<li className='value-column'>
				<Button style={{ width: '100%' }} disabled={!type || !path} onClick={create}>{t('submit').ucfirst()}</Button>
			</li>
		</ul>
	</div>;
	;
};

export default ProgramEditor;
