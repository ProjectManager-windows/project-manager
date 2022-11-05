import { useTranslation }                                             from 'react-i18next';
import { ProgressBar }                                                from 'primereact/progressbar';
import { Panel }                                                      from 'primereact/panel';
import { FontAwesomeIcon }                                            from '@fortawesome/react-fontawesome';
import { faClose }                                                    from '@fortawesome/free-solid-svg-icons';
import { ProgressBar as pb }                                          from '../../classes/ProgressBars';
import Notifications, { NotificationItem, NotificationItemInterface } from '../../classes/Notifications';
import '../../styles/ui/notification.scss';


function Notification(props: { item: NotificationItemInterface }) {
	const { t }    = useTranslation();
	const { item } = props;
	const header   = item.getName();
	const body     = item.getBody();
	const del      = () => {
		Notifications.del(item.getKey());
	};
	if (item instanceof pb) {
		const val     = item.getPercent();
		const total   = item.getTotal();
		const current = item.getCurrent();

		if (!val || total === 0 || current === 0) {
			return (
				<div className='notification'>
					<Panel header={header}>
						<span className='message'>{body}</span>
						<span className='close' onClick={() => del()}><FontAwesomeIcon icon={faClose} /></span>
						<ProgressBar mode='indeterminate' value={val} />
					</Panel>
				</div>
			);
		}
		return (
			<div className='notification'>
				<Panel header={header}>
					<p className='message'>{body}</p>
					<span className='close' onClick={() => del()}><FontAwesomeIcon icon={faClose} /></span>
					<ProgressBar value={val} />
				</Panel>
			</div>
		);

	}
	if (item instanceof NotificationItem) {
		return (
			<div className='notification'>
				<Panel header={header}>
					<span className='close' onClick={() => del()}><FontAwesomeIcon icon={faClose} /></span>
					{item.getBody()}
				</Panel>
			</div>
		);
	}
	return (
		<div>
			{t('error')}
		</div>
	);
}

export default Notification;
