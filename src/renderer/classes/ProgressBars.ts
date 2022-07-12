import EventEmitter                  from 'events';
import { NotificationItemInterface } from './Notifications';

type ProgressBarType = {
	total: number
	current: number
	key: string
	name: string
	message: string
}

export class ProgressBar implements NotificationItemInterface {
	private current: number = 0;

	private message: string = '';

	constructor(private key: string, private name = '', private total = 0) {
	}

	public setName(val: string) {
		this.name = val;
	}

	public setBody() {
	}

	public getKey() {
		return this.key;
	}

	public getName() {
		return this.name;
	}

	public getBody() {
		return this.message;
	}

	public setTotal(val: number) {
		this.total = val;
	}

	public getTotal() {
		return this.total;
	}

	public getCurrent() {
		return this.current;
	}

	public setCurrent(val: number) {
		this.current = val;
	}

	public getMessage() {
		return this.message;
	}

	public setMessage(val: string) {
		this.message = val;
	}

	public getPercent() {
		const p = Math.floor(this.current / this.total * 100);
		return p > 100 ? 100 : p;
	}

}

export class ProgressBars extends EventEmitter {
	private static instance: ProgressBars;

	public bars: { [k: string]: ProgressBar } = {};

	static getInstance() {
		if (!this.instance) {
			this.instance = new ProgressBars();
		}
		return this.instance;
	}

	private constructor() {
		super();
		window.electron.ipcRenderer.on('electron-progressbar-update', (message: ProgressBarType) => {
			if (this.bars[message.key] === undefined) {
				this.bars[message.key] = new ProgressBar(message.key, message.name, message.total);
			}
			this.bars[message.key].setName(message.name);
			this.bars[message.key].setTotal(message.total);
			this.bars[message.key].setCurrent(message.current);
			this.bars[message.key].setMessage(message.message);
			this.emit('progressbar-update', message.key, this.bars[message.key]);
		});
	}

}

export default ProgressBars.getInstance();
