import PM_Storage from '../Storage/PM_Storage';

export default {
	get(key: string) {
		return PM_Storage.getById('settings', key);
	},
	set(key: string, value: any) {
		PM_Storage.commit('settings', key, value);
	}
};
