import { EventEmitter } from 'events';
import util from 'util';
import dgram from 'dgram';
import parsePacket from '../parsePacket';

export default function Server() {
    EventEmitter.call(this);

    var _this = this;

    this.server = dgram.createSocket('udp4');
    
    this.server.on('message', function(packet) {
	console.log("message");
	console.log(parsePacket(packet))
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
