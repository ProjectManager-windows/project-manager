import { bridge }    from 'main/preload';
import i18n          from './classes/i18n';
import Notifications from './classes/Notifications';

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		electron: typeof bridge;
		i18n: typeof i18n;
		Notifications: typeof Notifications;
	}
}

export {};
