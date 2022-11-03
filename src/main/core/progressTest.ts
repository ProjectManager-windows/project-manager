// eslint-disable-next-line import/no-cycle
import ProgressBar from './Notifications/ProgressBar';

export default {
	run() {
		const total     = 10;
		let i           = 0;
		const p         = new ProgressBar('test', 'Привет мир', total);
		const interval  = setInterval(() => {
			i++;
			p.update({ total, current: i });
			if (i >= total) {
				clearInterval(interval);
			}
		}, 1000);
		const p2        = new ProgressBar('test2', 'Привет мир2', total);
		const interval2 = setInterval(() => {
			i++;
			p2.update({ total, current: i });
			if (i >= total) {
				clearInterval(interval2);
			}
		}, 1000);
	}
};
