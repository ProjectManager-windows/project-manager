import PM_Storage, { Tables } from '../Storage/PM_Storage';

export default {
	get(key: string) {
		return PM_Storage.getById(Tables.settings, key);
	},
	set(key: string, value: any) {
		PM_Storage.commit(Tables.settings, key, value);
	}
};
