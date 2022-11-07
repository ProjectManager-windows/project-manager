import { promisify } from 'util';
import { exec }      from 'child_process';
import net           from 'net';

export const asyncExec = promisify(exec);

export const cmdExist = async (cmd: string) => {
	return asyncExec(`(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul`).then(() => true).catch(() => false);
};


export const  portExist = async function(port:number) {
	return new Promise((resolve) => {
		const server = net.createServer(function(socket) {
			socket.write('Echo server\r\n');
			socket.pipe(socket);
		});
		server.on('error', function() {
			resolve(true);
		});
		server.on('listening', function() {
			server.close();
			resolve(false);
		});
		server.listen(port, '127.0.0.1');
	});
};
