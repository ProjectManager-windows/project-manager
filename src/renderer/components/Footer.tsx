import '../styles/Footer.scss';
import { useTranslation } from 'react-i18next';
import Notifications      from './Notifications';

function Footer() {
	const { t } = useTranslation();

	return (
		<div className={'Footer'}>
			<div className='left'>
				<i className='pi pi-check' title={t('ok')}/>
				{/* TODO */}
			</div>
			<div className='right'>
				{/* TODO */}
				<Notifications />
			</div>
		</div>
	);
};

export default Footer;
