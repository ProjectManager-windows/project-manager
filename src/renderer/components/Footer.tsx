import { useTranslation } from 'react-i18next';
import { Link }           from 'react-router-dom';
import Notifications      from './Notifications';
import '../styles/Footer.scss';
import LastProgressBar    from './ui/LastProgressBar';

function Footer() {
	const { t } = useTranslation();

	return (
		// @ts-ignore

		<div className='Footer'>
			<div className='left'>
				{/* <i className='tp pi pi-check' data-pr-tooltip={t('ok')} /> */}
				{/* TODO */}
			</div>
			<div className='right'>
				{/* TODO */}
				<Notifications />
				<Link data-pr-tooltip={t('settings')} to='/settings' className='tp footer-right-item'><i className='iBtn pi pi-sliders-h' /></Link>
				<LastProgressBar />
			</div>
		</div>

	);
}

export default Footer;
