import ProgressBar from './ProgressBar';

type ProgressBarType = {
	total: number
	current: number
	key: string
	name: string
	message: string
}


export class ProgressBars {
	private static instance: ProgressBars;

	public bars: { [k: string]: ProgressBar } = {};

	static getInstance() {
		if (!this.instance) {
			this.instance = new ProgressBars();
		}
		return this.instance;
	}

	private constructor() {
		window.electron.ipcRenderer.on('electron-progressbar-update', (message: ProgressBarType) => {
			if (this.bars[message.key] === undefined) {
				this.bars[message.key] = new ProgressBar(message.key, message.name, message.total);
			}
			this.bars[message.key].setName(message.name);
			this.bars[message.key].setTotal(message.total);
			this.bars[message.key].setCurrent(message.current);
			this.bars[message.key].setMessage(message.message);
			console.log(this.bars);
		});
	}

}

export default ProgressBars.getInstance();
