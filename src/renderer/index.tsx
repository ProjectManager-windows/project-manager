import { createRoot }         from 'react-dom/client';
import PrimeReact, { locale } from 'primereact/api';
import App                    from './App';
import i18n                   from './classes/i18n';
import Notifications          from './classes/Notifications';
import ucfirst                from '../utills/ucfirst';
import './styles/firaCode.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './styles/reset.scss';
import LanguagesExtensions    from '../../assets/Programming_Languages_Extensions.json';
import languagesColors        from '../../assets/Programming_Languages_colors.json';

PrimeReact.ripple     = true;
PrimeReact.inputStyle = 'filled';
locale(window.electron.settings.get('locale'));
// eslint-disable-next-line no-extend-native,func-names
String.prototype.ucfirst   = function() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return ucfirst(this);
};
window.i18n                = i18n;
window.Notifications       = Notifications;
window.LanguagesExtensions = LanguagesExtensions;
window.languagesColors     = languagesColors;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container            = document.getElementById('root')!;
const root                 = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const { once, sendMessage } = window.electron.ipcRenderer;
// once('ipc-example', (arg: any) => {
// 	// eslint-disable-next-line no-console
// 	console.log(arg);
// });
// sendMessage('ipc-example', ['ping']);
