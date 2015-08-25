export default function Stream(buffer) {
	if(buffer instanceof Buffer) {
		this._buffer = buffer;
	} else { // int ?
		this._buffer = new Buffer(buffer); 
	}
	this._offset = 0;
}

Stream.prototype.offset = function() { return this._offset; }
Stream.prototype.buffer = function() { return this._buffer; }
Stream.prototype.EOS = function() { return this._buffer.length <= this._offset; }

Stream.prototype.read8 = function() {
	this._offset++;
	return this._buffer.readUInt8(this._offset - 1);
}

Stream.prototype.write8 = function(value) {
	this._buffer.writeUInt8(value, this._offset);
	this._offset++;
}

Stream.prototype.read16 = function() {
	this._offset += 2;
	return this._buffer.readUInt32BE(this._offset - 2);
}

Stream.prototype.write16 = function(value) {
	this._buffer.writeUInt32BE(value, this._offset);
	this._offset += 2;
}

Stream.prototype.read32 = function() {
	this._offset += 4;
	return this._buffer.readUInt32BE(this._offset - 4);
}

Stream.prototype.write32 = function(value) {
	this._buffer.writeUInt32BE(value, this._offset);
	this._offset += 4;
}

Stream.prototype.readBuffer = function(length) {
	var b = new Buffer(length)
	this,_buffer.copy(b, 0, this._offset, length);
	this._offset += length;
}

Stream.prototype.writeBuffer = function(value) {
	value.copy(this._buffer, this._offset);
	this._offset += value.length;
}

Stream.prototype.readString = function(length) {
	return this._buffer.toString('ascii', this._offset, this._offset += length)
}

Stream.prototype.discard = function(length) {
	this._offset += length;
	return this;
}

Stream.prototype.fill = function(length) {
	this._buffer.fill(0, this._offset, this._offset += length);
	return this;
}
