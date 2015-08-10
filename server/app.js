import util from 'util';
import DhcpServer from './server';

var bindings = [
	{ addr: '0.0.0.0', port: 67 },
];
 

for(var i = 0; i < bindings.length; i++) {
	var server = new DhcpServer;

	server.on('message', function(m) {
		console.log('message: ', '(' + bindings[i].addr + ')', m.ciaddr)
	});

	server.on('listening', function(addr) {
		console.log('listening on ' + addr.addr + ':' + addr.port);
	});

	server.bind(bindings[i])
	.then(function() {
//		console.log('bound to ' + bindints.addr + ':' + bindTo.port);
	});
}
