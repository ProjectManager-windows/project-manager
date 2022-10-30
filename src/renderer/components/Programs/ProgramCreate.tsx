import { Dropdown }       from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import '../../styles/ProgramEditor.scss';
import { ProgramType }    from '../../../types/project';

const ProgramEditor = () => {
	const { t } = useTranslation();
	const cities = [
		{ name:ProgramType.other},
		{ name:ProgramType.ide},
		{ name:ProgramType.terminal},
	];
	return <div className="ProgramEditor">
		<h4>{t('create').ucfirst()}</h4>
		<Dropdown options={}/>
	</div>;
};

export default ProgramEditor;
