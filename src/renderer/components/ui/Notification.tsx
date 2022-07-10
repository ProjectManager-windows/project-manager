import { useTranslation }                              from 'react-i18next';
import { ProgressBar }                                 from 'primereact/progressbar';
import { ProgressBar as pb }                           from '../../classes/ProgressBars';
import { NotificationItem, NotificationItemInterface } from '../../classes/Notifications';
import { Panel }                                       from 'primereact/panel';

function Notification(props: { item: NotificationItemInterface }) {
	const { t }    = useTranslation();
	const { item } = props;
	const header   = item.getName();
	if (item instanceof pb) {
		const val = item.getPercent();

		if (val === 0) {
			return (
				<div className='Notification'>
					<Panel header={header}>
						<ProgressBar mode='indeterminate' value={val} />
					</Panel>
				</div>
			);
		}
		return (
			<div className='Notification'>
				<Panel header={header}>
					<ProgressBar value={val} />
				</Panel>
			</div>
		);

	}
	if (item instanceof NotificationItem) {
		const body = item.getBody();
		return (
			<div className='Notification'>
				<Panel header={header}>
					{body}
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
