import ProgressUnit        from './ProgressUnit';
// eslint-disable-next-line import/no-cycle
import APP                 from '../../main';
import { BackgroundEvens } from '../../../types/Enums';

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
		this.total   = progress.total;
		this.current = progress.current;
		this.message = progress.message ?? '';
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
		APP.sendRenderEvent(BackgroundEvens.ProgressbarUpdate, this.toArray());
	}
}


export default ProgressBar;
