
export class Notifications {
	private static instance: Notifications;

	public ProgressBars

	static getInstance() {
		if (!this.instance) {
			this.instance = new Notifications();
		}
		return this.instance;
	}

	private constructor() {
		this.ProgressBars = window.electron.ProgressBars;
	}
}

export default Notifications.getInstance();
