import '../styles/Footer.scss';
import { useTranslation } from 'react-i18next';
import Notifications      from './Notifications';
import { Link }           from 'react-router-dom';

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
				<Notifications />
				<Link to={'/settings'} ><i className='iBtn pi pi-sliders-h'/></Link>

			</div>
		</div>
	);
}

export default Footer;
