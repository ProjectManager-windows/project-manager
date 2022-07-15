import '../styles/Footer.scss';
import { useTranslation } from 'react-i18next';
import { Link }           from 'react-router-dom';
import Notifications      from './Notifications';

function Footer() {
	const { t } = useTranslation();

	return (
		<div className='Footer'>
			<div className='left'>
				<i className='tp pi pi-check' data-pr-tooltip={t('ok')} />
				{/* TODO */}
			</div>
			<div className='right'>
				{/* TODO */}
				<Notifications data-pr-tooltip={t('notifications')} className='tp footer-right-item' />
				<Link data-pr-tooltip={t('settings')}  to="/settings" className='tp footer-right-item'><i className='iBtn pi pi-sliders-h'/></Link>
			</div>
		</div>
	);
}

export default Footer;
