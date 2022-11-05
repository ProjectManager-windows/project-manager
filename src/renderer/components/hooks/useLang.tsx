import { useState }          from 'react';
import { addLocale, locale } from 'primereact/api';

export function useLang() {
	const [lang, _setLang] = useState(window.lang.get());

	function setLang(lang: string) {
		window.lang.set(lang);
		_setLang(lang);
		locale(lang);
		try {
			// @ts-ignore
			addLocale(lang, window.lang.languages[lang].translation);
		} catch (e) {
			console.warn(e);
		}
	}

	return [lang, setLang, window.lang.list];
}
