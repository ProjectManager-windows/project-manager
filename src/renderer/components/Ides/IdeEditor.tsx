import { IDEType }             from '../../../types/project';
import '../../styles/IdeEditor.scss';
import { Button }              from 'primereact/button';
import { useTranslation }      from 'react-i18next';
import { useEffect, useState } from 'react';

const IdeEditor = (props: { ide?: IDEType }) => {
	const { t }                       = useTranslation();
	const { ide }                     = props;
	let [isDefaultIde, setDefaultIde] = useState(false);
	useEffect(() => {
		if (ide) {
			setDefaultIde(Number(window.electron.settings.get('defaultIde')) == ide.id);
		}
	}, [ide]);
	if (ide) {
		return (
			<div className={`IdeEditor ${ide.name}`}>
				<h4>{ide.name}</h4>
				<Button
					disabled={isDefaultIde} onClick={() => {
					window.electron.settings.set('defaultIde', ide.id);
					setDefaultIde(true)
				}}
				>{t('set as default').ucfirst()}</Button>
			</div>
		);
	}
	return (<div className='IdeEditor'></div>);
};

export default IdeEditor;
