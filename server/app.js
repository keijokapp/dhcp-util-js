import util from 'util';
import DhcpServer from './server';

var binding = { addr: '0.0.0.0', port: 67 };
 

var server = new DhcpServer;

server.on('message', function(m) {
	console.log('message: ', '(' + binding.addr + ')', m)
});

server.on('listening', function(addr) {
	console.log('listening on ' + addr.addr + ':' + addr.port);
});

server.bind(binding)
.then(function() {
//		console.log('bound to ' + bindints.addr + ':' + bindTo.port);
});

