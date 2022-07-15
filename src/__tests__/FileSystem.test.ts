import PM_FileSystem from '../main/core/Utils/PM_FileSystem';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
jest.setTimeout(50_000);
describe('PM_FileSystem', () => {
	test('find', async () => {
		const $fs = new PM_FileSystem();
		const a   = await $fs.findProjects('/');
		// eslint-disable-next-line no-console
		console.log(a);
	});
	test('getDirectories', async () => {
		const $fs = new PM_FileSystem();
		const a   = await $fs.getDirectories('/');
		// eslint-disable-next-line no-console
		console.log(a.length);
	});
});
