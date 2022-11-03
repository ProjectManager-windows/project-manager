import APP                  from '../../main';
import { BackgroundEvents } from '../../../types/Events';

export interface ProgressUnit {
	total?: number;
	current: number;
	message?: string;
}

export class ProgressBar {
	private current: number = 0;

	private message: string = '';

	constructor(private key: string, private name = '', private total = 0) {
		this.sendUpdate();
	}

	public setName(val: string) {
		this.name = val;
		this.sendUpdate();
	}

	public setTotal(val: number) {
		this.total = val;
		this.sendUpdate();
	}

	public getKey() {
		return this.key;
	}

	public getName() {
		return this.name;
	}

	public getMessage() {
		return this.message;
	}

	public getTotal() {
		return this.total;
	}

	public update(progress: ProgressUnit) {
		if (progress.total) {
			this.total = progress.total;
		}
		this.current = progress.current;
		this.message = progress.message ?? '';
		this.sendUpdate();
	}

	public stop(message: string = '') {
		this.current = this.total;
		this.message = message;
		this.sendUpdate();
	}

	toArray() {
		return {
			total  : this.total,
			current: this.current,
			key    : this.key,
			name   : this.name,
			message: this.message
		};
	}

	private sendUpdate() {
		APP.sendRenderEvent(BackgroundEvents.ProgressbarUpdate, this.toArray()).then(() => null).catch(console.error);
	}
}


export default ProgressBar;
