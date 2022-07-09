import FileSystem from '../main/core/FileSystem';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
jest.setTimeout(500000);
describe('FileSystem', () => {
	test('find', async () => {
		const $fs = new FileSystem();
		return true;
		const a   = await $fs.findProjects('/', (_p, founded) => {
			if (founded) {

			} else {

			}
		});
		// eslint-disable-next-line no-console
		console.log(a);
	});
	test('getDirectories', async () => {
		const $fs = new FileSystem();
		return true;
		const a   = await $fs.getDirectories('/');
		// eslint-disable-next-line no-console
		console.log(a);
	});
});
