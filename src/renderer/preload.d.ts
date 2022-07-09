import { bridge } from 'main/preload';

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		electron: typeof bridge;
	}
}

export {};
