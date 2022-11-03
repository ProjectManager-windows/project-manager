import APP                  from '../../main';
import { BackgroundEvents } from '../../../types/Events';

export class Notification {

	private message: string = '';
	private name: string    = '';

	constructor(private key: string) {

	}

	setName(name: string) {
		this.name = name;
		return this;
	}

	setMessage(message: string) {
		this.message = message;
		return this;
	}

	update(message: string) {
		this.setMessage(message);
		this.send();
		return this;
	}

	send() {
		APP.sendRenderEvent(BackgroundEvents.NotificationUpdate, { key: this.key, name: this.name, message: this.message }).then(console.log).catch(console.error);
		return this;
	}
}
