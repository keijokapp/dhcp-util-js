import assert from 'assert';
import ip from 'ip';
import Stream from './DhcpStream';

export default function(pkt) {
	if (!('xid' in pkt)) throw new Error('pkt.xid required');
	if (!('chaddr' in pkt)) throw new Error('pkt.chaddr required');


	var ci = ip.toBuffer(pkt.ciaddr);
	var yi = ip.toBuffer(pkt.yiaddr);
	var si = ip.toBuffer(pkt.siaddr);
	var gi = ip.toBuffer(pkt.giaddr);


	var hw = new Buffer(pkt.chaddr.split(':').map(function(part) {
		return parseInt(part, 16);
	}));

	if (hw.length !== 6)
		throw new Error('pkt.chaddr malformed, only ' + hw.length + ' bytes');


	var s = new Stream(1500);
	
	s.write8(pkt.op);
	s.write8(pkt.htype);	
	s.write8(pkt.hlen);
	s.write8(pkt.hops);
	s.write32(pkt.xid);
	s.write16(pkt.secs);
	s.write16(pkt.flags);
	s.writeBuffer(ci);
	s.writeBuffer(yi);
	s.writeBuffer(si);
	s.writeBuffer(gi);
	s.writeBuffer(hw);
	s.fill(10);
	s.fill(192);
	s.write32(0x63825363);


	var i = s._offset;
	var p = s._buffer;
	
	if('requestedIpAddress' in pkt.options) {
		s.write8(50);
		var requestedIpAddress = ip.toBuffer(pkt.options.requestedIpAddress);
		s.write8(requestedIpAddress.length);
		s.writeBuffer(requestedIpAddress);
	}
	if('dhcpMessageType' in pkt.options) {
		s.write8(53);
		s.write8(1);
		s.write8(pkt.options.dhcpMessageType.value);
	}
	if('serverIdentifier' in pkt.options) {
		s.write8(54);
		var serverIdentifier = ip.toBuffer(pkt.options.serverIdentifier);
		s.write8(serverIdentifier.length);
		s.writeBuffer(serverIdentifier);
	}
	if('parameterRequestList' in pkt.options) {
		s.write8(55);
		var parameterRequestList = new Buffer(pkt.options.parameterRequestList);
//		if(parameterRequestList.length > 16)
//			throw new Error('pkt.options.parameterRequestList malformed');
		s.write8(parameterRequestList.length);
		s.writeBuffer(parameterRequestList);
	}
	if('clientIdentifier' in pkt.options) {
		s.write8(61);
		var clientIdentifier = new Buffer(pkt.options.clientIdentifier);
//		if (clientIdentifier.length > 15)
	//		throw new Error('pkt.options.clientIdentifier malformed');
		s.write8(clientIdentifier.length);
		s.writeBuffer(clientIdentifier);
	}

	// option 255 - end
	s.write8(0xff);

	var i = s.offset();
	if(i < 300) {
		s.fill(300 - i);
	}

	return s.buffer().slice(0, i);
}
