import EventEmitter         from 'events';
import ProgressBars         from './ProgressBars';
import { BackgroundEvents } from '../../types/Events';


export interface NotificationItemInterface {
	setName(name: string): void;

	setBody(name: string): void;

	getKey(): string;

	getName(): string;

	getBody(): string;
}

export class NotificationItem implements NotificationItemInterface {
	constructor(private key: string, private name: string, private body: string) {

	}

	public setName(val: string) {
		this.name = val;
	}

	public setBody(val: string) {
		this.body = val;
	}

	public getKey() {
		return this.key;
	}

	public getName() {
		return this.name;
	}

	public getBody() {
		return this.body;
	}

}

export class Notifications extends EventEmitter {
	private static instance: Notifications;

	public ProgressBars;

	public Notifications: { [k: string]: NotificationItem } = {};

	private constructor() {
		super();
		this.ProgressBars = ProgressBars;
		this.ProgressBars.on('progressbar-update', (key, bar) => {
			this.Notifications[key] = bar;
			this.emit('update', this.Notifications);
		});
		window.electron.ipcRenderer.on(BackgroundEvents.NotificationUpdate, (message: { key: string, name: string, message: string }) => {
			if (this.Notifications[message.key] === undefined) {
				this.Notifications[message.key] = new NotificationItem(message.key, message.name, message.message);
			}
			this.Notifications[message.key].setName(message.name);
			this.Notifications[message.key].setBody(message.message);
			this.emit('progressbar-update', message.key, this.Notifications[message.key]);
		});
	}

	del(key: string) {
		delete this.Notifications[key];
		this.emit('update', this.Notifications);
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Notifications();
		}
		return this.instance;
	}
}

export default Notifications.getInstance();
