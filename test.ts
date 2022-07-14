import { glob }   from 'glob';

(async () => {
	glob("**/@(favicon.ico|favicon.jpg|favicon.png|icon.png|icon.jpg|icon.ico|logo.ico|logo.jpg|logo.png)", {
		cwd:"C:\\projects\\gertudaV2",
		silent :true,
		nodir :true
	}, function (er, files) {
		console.error(er)
		console.log(files)
	})
})();



