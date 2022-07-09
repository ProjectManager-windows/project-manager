import '../styles/Footer.scss';
import { useTranslation } from 'react-i18next';

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
				<i className='iBtn pi pi-bell' title={t('notifications')} />
			</div>
		</div>
	);
};

export default Footer;
