import '../styles/Footer.scss';
import { useTranslation } from 'react-i18next';
import { Link }           from 'react-router-dom';
import Notifications      from './Notifications';

function Footer() {
	const { t } = useTranslation();

	return (
		<div className={'Footer'}>
			<div className='left'>
				<i className='pi pi-check' title={t('ok')} />
				{/* TODO */}
			</div>
			<div className='right'>
				{/* TODO */}
				<Notifications className='footer-right-item' />
				<Link to="/settings" className='footer-right-item'><i className='iBtn pi pi-sliders-h'/></Link>
			</div>
		</div>
	);
}

export default Footer;
