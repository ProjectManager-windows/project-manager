import ipcStore from './ipcStore';

type Main =
	{
		run: () => void,
		events: {
			[k: string]: {
				run: () => void,
			}
		}
	}

export const main: Main = {
	run() {
		for (const x in this.events) {
			if (x !== 'run') {
				this.events[x].run();
			}
		}
	},
	events: {
		ipcStore,
	}
};
export default main;
