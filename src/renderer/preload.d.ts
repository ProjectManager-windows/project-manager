import { bridge }          from 'main/preload';
import i18n                from './classes/i18n';
import Notifications       from './classes/Notifications';
import LanguagesExtensions from '../../assets/Programming_Languages_Extensions.json';
import { Icons }           from './icons/icons';

declare global {
	// eslint-disable-next-line no-underscore-dangle
	const __static: string;

	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		electron: typeof bridge;
		i18n: typeof i18n;
		Notifications: typeof Notifications;
		LanguagesExtensions: typeof LanguagesExtensions;
		languagesColors: { [key: string]: string };
		ImageCache: { [key: string]: any };
		icons: Icons;
		pixel: string;
	}

	interface String {
		ucfirst: () => string;
	}
}

export {};
