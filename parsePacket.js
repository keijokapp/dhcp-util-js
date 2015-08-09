import assert from 'assert';
import * as protocol from './protocol';
import ip from 'ip';
import Stream from './DhcpStream';


function trimNulls(str) {
	var idx = str.indexOf('\u0000');
	return (-1 === idx) ? str : str.substr(0, idx);
}

function readAddressRaw(s, len) {
	var addr = '';
	while(len-- > 0) {
		var b = s.read8();
		addr += (b + 0x100).toString(16).substr(-2);
		if(len > 0) addr += ':';
	}
	return addr;
}


export default function(msg) {
	var s = new Stream(msg);

	var hlen;
	var p = {
		op: protocol.BOOTPMessageType.get(s.read8()),
		htype: s.read8(),
		hlen: hlen = s.read8(),
		hops: s.read8(),
		xid: s.read32(),
		secs: s.read16(),
		flags: s.read16(),
		ciaddr: ip.fromLong(s.read32()),
		yiaddr: ip.fromLong(s.read32()),
		siaddr: ip.fromLong(s.read32()),
		giaddr: ip.fromLong(s.read32()),
		chaddr: readAddressRaw(s, hlen),
		sname: trimNulls(s.discard(10).readString(64)),
		file: trimNulls(s.readString(128)),
		magic: s.read32(),
		options: {}
	};

	loop: while(!s.EOS()) {
		var code = s.read8();

		switch (code) {
		case 0: continue;   // pad
		case 255: break loop;	// end

		case 1:		   // subnetMask
			p.subnetMask = ip.fromLong(s.read32())
			break;
		case 2:		   // timeOffset
			var len = s.read8();
			assert.strictEqual(len, 4);
			p.options.timeOffset = s.read32();
			break;
		case 3:		   // routerOption
			var len = s.read8();
			assert.strictEqual(len % 4, 0);
			p.options.routerOption = [];
			while(len > 0) {
				p.options.routerOption.push(ip.fromLong(s.read32()));
				len -= 4;
			}
			break;
		case 4:		   // timeServerOption
			var len = s.read8();
			assert.strictEqual(len % 4, 0);
			p.options.timeServerOption = [];
			while (len > 0) {
				p.options.timeServerOption.push(ip.fromLong(s.read32()));
				len -= 4;
			}
			break;
		case 6:		   // domainNameServerOption
			var len = s.read8();
			assert.strictEqual(len % 4, 0);
			p.options.domainNameServerOption = [];
			while (len > 0) {
				p.options.domainNameServerOption.push(ip.fromLong(s.read32()));
				len -= 4;
			}
			break;
		case 12:		  // hostName
			var len = s.read8();
			p.options.hostname = s.readString(len);
			break;
		case 15:		  // domainName
			var len = s.read8();
			p.options.domainName = p.options.hostname = s.readString(len);
			break;
		case 43:		  // vendorOptions
			var len = s.read8();
			p.options.vendorOptions = { };
			while(len > 0) {
				var vendop = s.read8();
				var vendoplen = s.read8();
				p.options.vendorOptions[vendop] = s.readBuffer(vendoplen);
				len -= 2 + vendoplen;
			}
			break;
		case 50:		  // requestedIpAddress
			p.requestedIpAddress = ip.fromLong(s.read32())
			break;
		case 51:		  // ipAddressLeaseTime
			var len = s.read8();
			assert.strictEqual(len, 4);
			p.options.ipAddressLeaseTime = msg.read32();
			break;
		case 52:		  // optionOverload
			var len = s.read8();
			assert.strictEqual(len, 1);
			p.options.optionOverload = s.read8();
			break;
		case 53:		  // dhcpMessageType
			var len = s.read8();
			assert.strictEqual(len, 1);
			var mtype = s.read8();
			assert.ok(1 <= mtype);
			assert.ok(8 >= mtype);
			p.options.dhcpMessageType = protocol.DHCPMessageType.get(mtype);
			break;
		case 54:		  // serverIdentifier
			p.serverIdentifier = ip.fromLong(s.read32());
			break;
		case 55:		  // parameterRequestList
			var len = s.read8();
			p.options.parameterRequestList = [];
			while(len-- > 0) {
				var option = s.read8();
				p.options.parameterRequestList.push(option);
			}
			break;
		case 57:		  // maximumMessageSize
			var len = s.read8();
			assert.strictEqual(len, 2);
			p.options.maximumMessageSize = s.read16();
			break;
		case 58:		  // renewalTimeValue
			var len = s.read8();
			assert.strictEqual(len, 4);
			p.options.renewalTimeValue = msg.read32();
			break;
		case 59:		  // rebindingTimeValue
			var len = s.read8();
			p.options.rebindingTimeValue = msg.read32();
			break;
		case 60:		  // vendorClassIdentifier
			var len = s.read8();
			p.options.vendorClassIdentifier = s.readString(len);
			break;
		case 61:		  // clientIdentifier
			var len = s.read8();
			p.options.clientIdentifier = s.readString(len);
			break;
/*		case 81:		  // fullyQualifiedDomainName
			var len = s.read8();
			p.options.fullyQualifiedDomainName = {
				flags: s.read8(),
				name: s.discard(2).msg.toString('ascii', offset + 2, offset + len - 1)
			};
			offset += len;
			break;*/
		case 118:			// subnetSelection
			p.subnetAddress = ip.fromLong(s.read32())
			break;
		default:
			var len = s.read8();
			console.log('Unhandled DHCP option ' + code + '/' + len + 'b');
			s.discard(len);
			break;
		}
	}
	return p;
};
