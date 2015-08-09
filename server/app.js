import util from 'util';
import DhcpServer from './server';

var bindTo = {
	addr: '10.1.4.1',
//	addr: '0.0.0.0',
//	addr: '255.255.255.255',
	port: 67
};


var server = new DhcpServer;

server.on('message', function(m) {
    console.log(util.inspect(m, false, 3));
});

server.on('listening', function(addr) {
	console.log('listening on ' + addr.addr + ':' + addr.port);
});

server.bind(bindTo)
.then(function() {
	console.log('bound to ' + bindTo.addr + ':' + bindTo.port);
});
