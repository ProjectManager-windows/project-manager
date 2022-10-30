import { Button }              from 'primereact/button';
import { useTranslation }      from 'react-i18next';
import { useEffect, useState } from 'react';
import '../../styles/ProgramEditor.scss';
import { ProgramFields }       from '../../../types/project';


// eslint-disable-next-line react/require-default-props
const ProgramEditor = (props: { Program?: ProgramFields }) => {
	const { t }                                 = useTranslation();
	const { Program }                           = props;
	const [isDefaultProgram, setDefaultProgram] = useState(false);
	useEffect(() => {
		if (Program) {
			setDefaultProgram(Number(window.electron.settings.get('defaultProgram')) === Program.id);
		}
	}, [Program]);
	if (Program) {
		return (
			<div className={`ProgramEditor ${Program.name}`}>
				<h4>{Program.name}</h4>
				<Button
					disabled={isDefaultProgram} onClick={() => {
					window.electron.settings.set('defaultProgram', Program.id);
					setDefaultProgram(true);
				}}
				>{t('set as default').ucfirst()}</Button>
			</div>
		);
	}
	return (<div className='ProgramEditor' />);
};

export default ProgramEditor;
