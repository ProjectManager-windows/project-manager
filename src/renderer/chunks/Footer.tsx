import '../styles/Footer.scss';
import React from 'react';
import { withTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line react/prop-types
function Footer ({ t }) {
	const name  = 'Footer';
	return (
		<div className={name}>
			<div className='left'>
				<i className='pi pi-check' />
				{/* TODO */}
			</div>
			<div className='right'>
				{/* TODO */}
				<i className='iBtn pi pi-bell' title={t('notification')} />
			</div>
		</div>
	);
};

export default withTranslation()(Footer);
