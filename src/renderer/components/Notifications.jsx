import '../styles/Notifications.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from 'primereact/sidebar';


function Notifications() {
	const { t } = useTranslation();
	const [visibleRight, setVisibleRight] = useState(false);
	return (
		<div>
			<Sidebar visible={visibleRight} position='right' onHide={() => setVisibleRight(false)}>
				<h3>{t('notifications').toUpperCase()}</h3>
			</Sidebar>
			<i className='iBtn pi pi-bell' title={t('notifications')}  onClick={() => setVisibleRight(true)}/>
		</div>
	);
};

export default Notifications;
