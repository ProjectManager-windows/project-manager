import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import en                   from '../../locale/common/en.json';
import ru                   from '../../locale/common/ru.json';
import Store                from 'electron-store';

const store = new Store();

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
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
			  lng          : store.get<any, string>('settings.locale') || 'en',
			  interpolation: {
				  escapeValue: false // react already safes from xss
			  }
		  });
export const t = (key: string) => i18n.t(key);
export default i18n;
