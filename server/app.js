import util from 'util';
import DhcpServer from './server';

var bindings = [
	{ addr: '0.0.0.0', port: 67 },
	{ addr: '255.255.255.255', port: 67 },
//	{ addr: '10.1.4.1', port: 67 },
//	{ addr: '10.1.4.0', port: 67 }
];


for(var i = 0; i < bindings.length; i++) {
	var server = new DhcpServer;

	server.on('message', function(m) {
		console.log('message: ', '(' + bindings[i].addr + ')', m.ciaddr)//util.inspect(m, false, 3));
	});

	server.on('listening', function(addr) {
		console.log('listening on ' + addr.addr + ':' + addr.port);
	});

	server.bind(bindings[i])
	.then(function() {
//		console.log('bound to ' + bindints.addr + ':' + bindTo.port);
	});
}
