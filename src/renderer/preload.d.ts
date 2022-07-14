import { bridge }          from 'main/preload';
import i18n                from './classes/i18n';
import Notifications       from './classes/Notifications';
import LanguagesExtensions from '../../assets/Programming_Languages_Extensions.json';

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		electron: typeof bridge;
		i18n: typeof i18n;
		Notifications: typeof Notifications;
		LanguagesExtensions: typeof LanguagesExtensions;
		languagesColors: { [key: string]: string };
	}

	interface String {
		ucfirst: () => string;
	}
}

export {};
