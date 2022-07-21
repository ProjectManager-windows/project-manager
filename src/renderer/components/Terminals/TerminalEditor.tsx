import { Button }              from 'primereact/button';
import { useTranslation }      from 'react-i18next';
import { useEffect, useState } from 'react';
import { TerminalType }        from '../../../types/project';
import '../../styles/TerminalEditor.scss';


// eslint-disable-next-line react/require-default-props
const TerminalEditor = (props: { terminal?: TerminalType }) => {
	const { t }                                   = useTranslation();
	const { terminal }                            = props;
	const [isDefaultTerminal, setDefaultTerminal] = useState(false);
	useEffect(() => {
		if (terminal) {
			setDefaultTerminal(Number(window.electron.settings.get('defaultTerminal')) === terminal.id);
		}
	}, [terminal]);
	if (terminal) {
		return (
			<div className={`TerminalEditor ${terminal.name}`}>
				<h4>{terminal.name}</h4>
				<Button
					disabled={isDefaultTerminal} onClick={() => {
					window.electron.settings.set('defaultTerminal', terminal.id);
					setDefaultTerminal(true);
				}}
				>{t('set as default').ucfirst()}</Button>
			</div>
		);
	}
	return (<div className='TerminalEditor'/>);
};

export default TerminalEditor;
