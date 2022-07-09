import { bridge } from 'main/preload';
import i18n       from './i18n';

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		electron: typeof bridge;
		i18n: typeof i18n;
	}
}

export {};
