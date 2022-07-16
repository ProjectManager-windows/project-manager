import { useTranslation }                              from 'react-i18next';
import { ProgressBar }                                 from 'primereact/progressbar';
import { Panel }                                       from 'primereact/panel';
import { ProgressBar as pb }                           from '../../classes/ProgressBars';
import { NotificationItem, NotificationItemInterface } from '../../classes/Notifications';
import '../../styles/notification.scss';

function Notification(props: { item: NotificationItemInterface }) {
	const { t }    = useTranslation();
	const { item } = props;
	const header   = item.getName();
	const body     = item.getBody();
	if (item instanceof pb) {
		const val     = item.getPercent();
		const total   = item.getTotal();
		const current = item.getCurrent();

		if (!val || total === 0 || current === 0) {
			return (
				<div className='notification'>
					<Panel header={header}>
						<span className='message'>{body}</span>
						<ProgressBar mode='indeterminate' value={val} />
					</Panel>
				</div>
			);
		}
		return (
			<div className='notification'>
				<Panel header={header}>
					<p className='message'>{body}</p>
					<ProgressBar value={val} />
				</Panel>
			</div>
		);

	}
	if (item instanceof NotificationItem) {
		return (
			<div className='notification'>
				<Panel header={header}>
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
