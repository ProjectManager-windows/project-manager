import { useTranslation }                              from 'react-i18next';
import { ProgressBar }                                 from 'primereact/progressbar';
import { ProgressBar as pb }                           from '../../classes/ProgressBars';
import { NotificationItem, NotificationItemInterface } from '../../classes/Notifications';


function Notification(props: { item: NotificationItemInterface }) {
	const { t }    = useTranslation();
	const { item } = props;
	if (item instanceof pb) {
		const val = item.getPercent();
		if (val === 0) {
			return (
				<div>
					<ProgressBar mode="indeterminate" value={val} />
				</div>
			);
		}
		return (
			<div>
				<ProgressBar value={val} />
			</div>
		);

	}
	if (item instanceof NotificationItem) {
		return (
			<div>
				{t('error2')}
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
