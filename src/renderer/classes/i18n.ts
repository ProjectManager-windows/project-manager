import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import en                   from '../../../assets/locale/common/en.json';
import ru                   from '../../../assets/locale/common/ru.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
	en: {
		translation: en
	},
	ru: {
		translation: ru
	}
};
i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
			  resources,
			  lng          : window.electron.store.get('settings.locale'),
			  interpolation: {
				  escapeValue: false // react already safes from xss
			  }
		  });
export const languages= Object.keys(resources) as Array<keyof typeof resources>;

export function setLanguage(language: string) {
	window.electron.store.set('settings.locale', language);
	i18n.changeLanguage(language);
}
export function getLanguage() {
	return window.electron.store.get('settings.locale');
}

export default i18n;
