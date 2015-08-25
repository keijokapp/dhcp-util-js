import { EventEmitter } from 'events';
import util from 'util';
import dgram from 'dgram';
import parsePacket from '../parsePacket';
import createPacket from '../createPacket';
import * as protocol from '../protocol';

export default function Client(options) {
	var _this = this;
	EventEmitter.call(this);

	this.client = dgram.createSocket('udp4');

	this.client.on('message', function(msg) {
		var pkt = parsePacket(msg);
		switch(pkt.options.dhcpMessageType.value) {
		case protocol.DHCPMessageType.DHCPOFFER.value:
			_this.emit('dhcpOffer', pkt);
			break;
		case protocol.DHCPMessageType.DHCPACK.value:
			_this.emit('dhcpAck', pkt);
			break;
		case protocol.DHCPMessageType.DHCPNAK.value:
			_this.emit('dhcpNak', pkt);
			break;
		default:
			assert(!'Client: received unhandled DHCPMessageType ' +
				pkt.options.dhcpMessageType.value);
		}
	});

	this.client.on('listening', function() {
		var address = _this.client.address();
		_this.emit('listening', address.address + ':' + address.port);
	});
}

util.inherits(Client, EventEmitter);

Client.prototype.bind = function(options) {
	var addr = '0.0.0.0';
	var port = 68;
	if (options) {
		if('addr' in options) addr = options.addr;
		if('port' in options) port = options.port;
	}

	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.client.bind(port, addr, function(err) {
			if(err) reject();
			else {
				_this.client.setBroadcast(true);
				resolve();
			}
		});
	});
}

Client.prototype.broadcastPacket = function(pkt, options) {
	var addr = '255.255.255.255';
	var port = 67;
	if (options) {
		if('addr' in options) addr = options.addr;
		if('port' in options) port = options.port;
	}

	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.client.send(pkt, 0, pkt.length, port, addr, function(err) {
			if(err) reject(err);
			else resolve();
		});
	})
}

Client.prototype.createDiscoverPacket = function(user) {
	var pkt = {
		op:	 0x01,
		htype:  0x01,
		hlen:   0x06,
		hops:   0x00,
		xid:    0x00000000,
		secs:   0x0000,
		flags:  0x0000,
		ciaddr: '0.0.0.0',
		yiaddr: '0.0.0.0',
		siaddr: '0.0.0.0',
		giaddr: '0.0.0.0',
	};
	if('xid' in user) pkt.xid = user.xid;
	if('chaddr' in user) pkt.chaddr = user.chaddr;
	if('options' in user) pkt.options = user.options;
	return createPacket(pkt);
}
