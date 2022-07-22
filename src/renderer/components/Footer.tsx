import { useTranslation }            from 'react-i18next';
import { Link }                      from 'react-router-dom';
import { useEffect, useState }       from 'react';
import { ProgressBar }               from 'primereact/progressbar';
import Notifications                 from './Notifications';
import { NotificationsContext }      from './context/NotificationsContext';
import { NotificationItemInterface } from '../classes/Notifications';
import '../styles/Footer.scss';

function Footer() {
	const { t }                         = useTranslation();
	const [notificationList, setNotify] = useState<NotificationItemInterface[]>([]);
	const updateNotify                  = () => {
		setNotify(Object.values(window.Notifications.Notifications));
	};
	useEffect(() => {
		window.Notifications.on('update', updateNotify);
		return () => {
			window.Notifications.off('update', updateNotify);
		};
	}, []);
	return (
		// @ts-ignore
		<NotificationsContext.Provider value={notificationList}>
			<div className='Footer'>
				<div className='left'>
					{/* <i className='tp pi pi-check' data-pr-tooltip={t('ok')} /> */}
					{/* TODO */}
				</div>
				<div className='right'>
					{/* TODO */}
					<Notifications />
					<Link data-pr-tooltip={t('settings')} to='/settings' className='tp footer-right-item'><i className='iBtn pi pi-sliders-h' /></Link>
					{/* <ProgressBar style={{ width: '150px' }} value={1} /> */}
				</div>
			</div>
		</NotificationsContext.Provider>
	);
}

export default Footer;
