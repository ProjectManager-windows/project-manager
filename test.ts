import FileSystem from './src/main/core/FileSystem';

(async () => {
	const time = process.hrtime();
	const $fs  = new FileSystem();
	const a    = await $fs.findProjects('/');
	const end  = process.hrtime(time);
	console.log(`${(end[0] + end[1] / 1e9).toFixed(9)} seconds`);
	console.log(a);
})();



