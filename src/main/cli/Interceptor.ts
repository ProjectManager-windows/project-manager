import express, { Express } from 'express';

class Interceptor {
	private static instance: Interceptor;
	private server: Express;

	private constructor() {
		this.server = express();
		this.server.use(function(req, res, next) {
			res.set('Content-Type', 'text/plain');
			req.body = '';
			req.setEncoding('utf8');

			req.on('data', function(chunk) {
				req.body += chunk;
			});

			req.on('end', function() {
				next();
			});
		});
		this.server.all('/', (req, res) => {
			res.send(this.cli(req.body));
		});
	}


	cli(args: string): string {
		console.log(args);

		return args;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Interceptor();
		}
		return this.instance;
	}

	init(port ?: number) {
		if (!port) port = 8001;
		this.server.listen(port);
	}

	close() {

	}

	restart(port ?: number) {
		this.close();
		if (!port) port = 8001;
		this.server.listen(port);
	}
}

export default Interceptor.getInstance();
