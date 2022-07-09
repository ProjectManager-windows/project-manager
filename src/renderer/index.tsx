import { createRoot } from 'react-dom/client';
import './i18n';
import App            from './App';
import i18n           from './i18n';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root      = createRoot(container);
root.render(<App />);
window.i18n = i18n
// calling IPC exposed from preload script
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const { once, sendMessage } = window.electron.ipcRenderer;
// once('ipc-example', (arg: any) => {
// 	// eslint-disable-next-line no-console
// 	console.log(arg);
// });
// sendMessage('ipc-example', ['ping']);
