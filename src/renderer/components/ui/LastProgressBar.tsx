import { ProgressBar }       from 'primereact/progressbar';
import { useContext }        from 'react';
import { AppContext }        from '../context/AppContext';
import { ProgressBar as pb } from '../../classes/ProgressBars';

const LastProgressBar = () => {
	const { notificationList, setShowNotify } = useContext(AppContext);
	if (notificationList.length >= 0) {
		const reversed = notificationList.reverse();
		let bar        = null;
		for (let i = 0; i < reversed.length; i++) {
			const notify = reversed[i];
			if (notify instanceof pb) {
				bar = notify;
				break;
			}
		}
		if (bar) {
			return (
				<div onClick={() => setShowNotify(true)}>
					<ProgressBar style={{ width: '150px' }} value={bar.getPercent()} />
				</div>
			);
		}
	}
	return (
		<div />
	);
};

export default LastProgressBar;
