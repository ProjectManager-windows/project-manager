import { createRoot }                                           from 'react-dom/client';
import PrimeReact, { addLocale, locale }                        from 'primereact/api';
import App                                                      from './App';
import i18n, { getLanguage, languages, resources, setLanguage } from './classes/i18n';
import Notifications                                            from './classes/Notifications';
import ucfirst                                                  from '../utills/ucfirst';
import './styles/ui/firaCode.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './styles/ui/reset.scss';
import './styles/index.scss';
import LanguagesExtensions                                      from '../../assets/Programming_Languages_Extensions.json';
import languagesColors                                          from '../../assets/Programming_Languages_colors.json';
import AppTray                                                  from './AppTray';
import icons                                                    from './icons/icons';
import dayjs                                                    from 'dayjs';
import relativeTime                                             from 'dayjs/plugin/relativeTime';
import $                                 from 'jquery';
import 'dayjs/locale/es';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
PrimeReact.ripple            = true;
PrimeReact.inputStyle        = 'filled';
String.prototype.ucfirst     = function() {
	// @ts-ignore
	return ucfirst(this);
};
Number.prototype.formatBytes = function(decimals = 2, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']) {
	let bytes = this as number;
	if (!+bytes) return '0 Bytes';
	const k  = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const i  = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
window.i18n                  = i18n;
window.lang                  = {
	set      : setLanguage,
	get      : getLanguage,
	list     : languages,
	languages: resources
};
window.$                     = $;
window.JQuery                = $;
window.Notifications = Notifications;
dayjs.locale(window.lang.get());
window.dayjs               = dayjs;
window.LanguagesExtensions = LanguagesExtensions;
window.languagesColors     = languagesColors;
window.ImageCache          = {};
window.icons               = icons;
window.pixel               = icons.pixel;
addLocale('ru', window.lang.languages.ru.translation);
addLocale('en', window.lang.languages.en.translation);
locale(window.lang.get());
const container       = document.getElementById('root')!;
const root            = createRoot(container);
const TrayWindowWidth = window.electron.store.get('engine.TrayWindowWidth');
window.document.addEventListener('mousemove', (e) => {
	window.mouse = e;
});

Object.assign(console, window.electron.log.functions);
if (window.innerWidth <= TrayWindowWidth + 5) {
	root.render(<AppTray />);
} else {
	root.render(<App />);
}
