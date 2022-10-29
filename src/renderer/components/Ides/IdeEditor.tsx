import '../../styles/IdeEditor.scss';
import { Button }              from 'primereact/button';
import { useTranslation }      from 'react-i18next';
import { useEffect, useState } from 'react';
import { IDEType }             from '../../../types/project';


const IdeEditor = (props: { ide: IDEType }) => {
	const { t }                       = useTranslation();
	const { ide }                     = props;
	let [isDefaultIde, setDefaultIde] = useState(false);
	useEffect(() => {
		setDefaultIde(Number(window.electron.settings.get('defaultIde')) === ide.id);
	}, [ide]);
		return (
			<div className={`IdeEditor ${ide.name}`}>
				<h4>{ide.name}</h4>
				<Button
					disabled={isDefaultIde} onClick={() => {
					window.electron.settings.set('defaultIde', ide.id);
					setDefaultIde(true);
				}}
				>{t('set as default').ucfirst()}</Button>
			</div>
		);
};

export default IdeEditor;
