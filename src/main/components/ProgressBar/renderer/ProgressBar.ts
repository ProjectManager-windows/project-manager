export class ProgressBar {
	private current: number = 0;

	private message: string = '';

	constructor(private key: string, private name = '', private total = 0) {
	}

	public setName(val: string) {
		this.name = val;
	}

	public setTotal(val: number) {
		this.total = val;
	}

	public getKey() {
		return this.key;
	}

	public getName() {
		return this.name;
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

}

export default ProgressBar;
