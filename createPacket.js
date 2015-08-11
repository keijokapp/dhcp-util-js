import assert from 'assert';
import ip from 'ip';
import Stream from './DhcpStream';

export default function(pkt) {
	var hw = new Buffer(pkt.chaddr.split(':').map(function(part) {
		return parseInt(part, 16);
	}));

//	if (hw.length !== 6)
	//	throw new Error('pkt.chaddr malformed, only ' + hw.length + ' bytes');


	var s = new Stream(1500);
	
	s.write8(pkt.op);
	s.write8(pkt.htype);	
	s.write8(hw.length);
	s.write8(pkt.hops);
	s.write32(pkt.xid);
	s.write16(pkt.secs);
	s.write16(pkt.broadcast ? 1 : 0);
	s.writeBuffer(ip.toBuffer(pkt.ciaddr));
	s.writeBuffer(ip.toBuffer(pkt.yiaddr));
	s.writeBuffer(ip.toBuffer(pkt.siaddr));
	s.writeBuffer(ip.toBuffer(pkt.giaddr));
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
		s.write8([0, 'DHCPDISCOVER', 'DHCPOFFER', 'DHCPREQUEST', 'DHCPDECLINE', 'DHCPACK', 'DHCPNAK', 'DHCPRELEASE'].indexOf(pkt.options.dhcpMessageType));
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
		s.write8(parameterRequestList.length);
		s.writeBuffer(parameterRequestList);
	}
	if('clientIdentifier' in pkt.options) {
		s.write8(61);
		var clientIdentifier = new Buffer(pkt.options.clientIdentifier);
		s.write8(clientIdentifier.length);
		s.writeBuffer(clientIdentifier);
	}

	s.write8(0xff);

	var i = s.offset();
	if(i < 300) s.fill(300 - i);

	return s.buffer().slice(0, i);
}
