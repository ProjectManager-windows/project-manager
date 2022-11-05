import { bridge }                                               from 'main/preload';
import i18n, { getLanguage, languages, resources, setLanguage } from './classes/i18n';
import Notifications                                            from './classes/Notifications';
import LanguagesExtensions                           from '../../assets/Programming_Languages_Extensions.json';
import { Icons }                                     from './icons/icons';

type sizes = [string, string, string, string, string, string, string, string, string]
declare global {
	// eslint-disable-next-line no-underscore-dangle
	const __static: string;

	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		electron: typeof bridge;
		lang: {
			set: typeof setLanguage;
			get: typeof getLanguage;
			list: typeof languages;
			languages: typeof resources;
		};
		$: typeof $;
		JQuery: typeof $;
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

	interface Number {
		formatBytes: (decimals?: number, sizes?: sizes) => string;
	}
}

export {};
