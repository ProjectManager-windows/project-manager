import { createRoot } from 'react-dom/client';
import App            from './App';
import i18n           from './classes/i18n';
import Notifications  from './classes/Notifications';
import ucfirst        from '../utills/ucfirst';

String.prototype.ucfirst = function() {
	// @ts-ignore
	return ucfirst(this);
};
window.i18n              = i18n;
window.Notifications     = Notifications;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container          = document.getElementById('root')!;
const root               = createRoot(container);
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
