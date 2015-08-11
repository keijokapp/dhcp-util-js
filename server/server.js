import { EventEmitter } from 'events';
import util from 'util';
import dgram from 'dgram';
import parsePacket from '../parsePacket';
import createPacket from '../createPacket';

export default function Server() {
    EventEmitter.call(this);

    var _this = this;

    this.server = dgram.createSocket('udp4');
    
    this.server.on('message', function(packet, rinfo) {
		switch(pkt.options.dhcpOptionType) {
		case 'DISCOVER':
			_this.emit('discover', packet, rinfo);
			
		}
		_this.emit('message', parsePacket(packet), rinfo)	
    });
    
    this.server.on('listening', function() {
        var address = _this.server.address();
        _this.emit('listening', { addr: address.address, port: address.port });
    });
}

util.inherits(Server, EventEmitter);

Server.prototype.bind = function(options) {
	var addr = '0.0.0.0';
	var port = 67;
    if(options) {
		if('addr' in options) addr = options.addr;
		if('port' in options) port = options.port;
    }

	var _this = this;
 	return new Promise(function(resolve, reject) {
		_this.server.bind(port, addr, function(err) {
			if(err) reject(err);
			else {
				_this.server.setBroadcast(true);
				resolve();
			}
		});
	});
}

Server.prototype.serverIdentity = function(ip) {
	if(ip) this._serverIdentity = ip;
	else return this,_serverIdentity;
}

Server.prototype.offer = function(pkt) {
	var options = what.options;
	
	options.dhcpMessageType = 'DHCPOFFER';
	options.serverIdentifer = this._serverIdentity;

	var packet = createPacket({
		op: 0x01,
		htype: 0x01,
		hlen: 0x06,
		xid: pkt.xid,
		secs: 0,
		flags: 0,
		ciaddr: 0,
		yiaddr: pkt.yiaddr,
		siaddr: this._serverIdentity,
		giaddr: 0,
		chaddr: pkt.chaddr,
		magic: 0x63825363,
		options: options
	});
	
	this._server.send(packet);
}

Server.prototype.send = function(packet) {
	
}
