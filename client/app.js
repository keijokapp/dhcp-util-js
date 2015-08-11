import util from 'util';
import DhcpClient from './client';
import * as DhcpProtocol from '../protocol';
import parsePacket from '../parsePacket';

var bindTo = {
	addr: '0.0.0.0',
	port: 68
};

var sendTo = {
	addr: '10.1.4.1',
	port: 67
};


var client = new DhcpClient();

client.on('listening', function(addr) {
    console.log('listening on', addr);
});

client.on('message', function(msg) {
	console.log('message', msg);
})

/*client.bind(bindTo)
.then(function() {
    console.log('bound to ' + bindTo.addr + ':' + bindTo.port);
})*/Promise.resolve()

.then(function() {
	var discover = client.createDiscoverPacket({
		xid: 0x01,
		chaddr: '00:01:02:03:04:05',
		options: {
		    dhcpMessageType: DhcpProtocol.DHCPMessageType.DHCPDISCOVER,
		    clientIdentifier: 'asdasdasd',
		}
	});
	
	console.log("Sending: ", parsePacket(discover))

	return client.broadcastPacket(discover, sendTo)
})
.then(function() {
    console.log('sent packet');
})
.catch(function(err) {
	console.error('catched: ', err)
	err.stack.split('\n').forEach((line) => console.log(line))
})
.then(function() {
	process.exit(0);
});
