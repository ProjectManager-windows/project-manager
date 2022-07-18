/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path    from 'path';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
	resolveHtmlPath = (htmlFileName: string) => {
		if (htmlFileName === 'tray.html') {
			const port   = process.env.PORT_TRAY || 1213;
			const url    = new URL(`http://localhost:${port}`);
			url.pathname = htmlFileName;
			return url.href;
		}
		const port   = process.env.PORT || 1212;
		const url    = new URL(`http://localhost:${port}`);
		url.pathname = htmlFileName;
		return url.href;
	};
} else {
	resolveHtmlPath = (htmlFileName: string) => {
		return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
	};
}
