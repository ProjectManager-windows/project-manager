import { useEffect, useState }       from 'react';
import { useTranslation }            from 'react-i18next';
import { Sidebar }                   from 'primereact/sidebar';
import { NotificationItemInterface } from '../classes/Notifications';
import Notification                  from './ui/Notification';
import '../styles/notifications.scss';


function Notifications() {
	const { t }                           = useTranslation();
	const [visibleRight, setVisibleRight] = useState(false);
	const [notificationList, setNotify]   = useState<NotificationItemInterface[]>([]);
	const updateNotify                    = () => {
		setNotify(Object.values(window.Notifications.Notifications));
	};
	useEffect(() => {
		window.Notifications.on('update', updateNotify);
	}, []);
	useEffect(() => {
		return () => {
			window.Notifications.off('update', updateNotify);
		};
	}, []);
	return (
		<div >
			<Sidebar className='notifications' visible={visibleRight} position='right' onHide={() => setVisibleRight(false)}>
				<h2 className='header'>{t('notifications').ucfirst()}</h2>
				{notificationList.map((item) => <Notification item={item} key={item.getKey()} />)}
			</Sidebar>
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
			<i className='iBtn pi pi-bell' title={t('notifications')} onClick={() => setVisibleRight(true)} />
		</div>
	);
}

export default Notifications;
