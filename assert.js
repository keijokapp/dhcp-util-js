var ENABLED = true;


var		equal = function(a, b, msg) {
			if(a != b) throw Error(a + " is not " + b + ": " + msg);
		},
		equalStrict = function(a, b, msg) {
			if(a !== b) throw Error(a + " is not strictly " + b + ": " + msg);
		},
		notEqual = function(a, b, msg) {
			if(a == b) throw Error(a + " is " + b + ": " + msg);
		},
		notEqualStrict = function(a, b, msg) {
			if(a === b) throw Error(a + " is strictly: " + msg);
		},
		ok = function(a, msg) {
			if(!a) throw Error("expected " + a + " to be truthy: " + msg);
		},
		notOk = function(a, msg) {
			if(a) throw Error("expected " + a + " to be falsy: " + msg);
		},


		/*
		 * checks function argument types
		 * Example:

		myObj.myMethod = function(argInt, argFloat, argWebSocket) {
			// do stuff
		}.schema('int', 'float', WebSocket);

		 * valid types:
		 * * 'null', 'undefined', 'string', 'int', 'uint', 'number', 'boolean'
		 * * undefined, false, null, whatever (no check)
		 * * any Function object (constructor)
		 * * array of types listed above (if multiple types are allowed)
		 */
		a = 0,
		type = function(value, types) {
			if(!types) return;
			var b = a++
			var types = types instanceof Array ? types : [ types ];
			var found = false;
			for(var i = 0; i < types.length && !found; i++) {
				var t = types[i];
				switch(t) {
				case 'undefined':
				case 'number':
				case 'boolean':
				case 'string': found = typeof value === t; break;
				case 'null': found = value === null; break;
				case 'int': found = parseInt(value) === value; break;
				case 'uint': found = parseInt(value) === value && value >= 0; break;
				default:
					if(t instanceof Function) {
						found = value instanceof t;
					} else if(typeof t === 'object' && t !== null) {
						for(var ii in t)
							type(value[ii], t[ii]);
						found = true;
					}
				}
			}
			if(!found) throw new TypeError('expected ' + JSON.stringify(types) + ', got ' + JSON.stringify(value));
		},

		functionSchema = function() {
			var _this = this;
			var _arguments = arguments;
			return function tmp() {
				for(var i = 0, l = _arguments.length; i < l; i++) {
					type(arguments[i], _arguments[i]);
				}
				
				if(this !== undefined && this !== null && this.__proto__ === tmp.prototype) {
					console.log('asdasd');
				} else {
					return _this.apply(this, arguments);
				}
			}
		},
		
		functionConstructor = function() {
			var _this = this;
			var _arguments = arguments;
			return function tmp() {
				if(!this || this.__proto__ !== tmp.prototype)
					assert.ok(false, 'not called as constructor');
			}
		};


Object.defineProperty(Function.prototype, 'schema', {
	enumerable: false,
	value: functionSchema
});
Object.defineProperty(Function.prototype, 'constructor', {
	enumerable: false,
	value: functionConstructor
});

export {
	ok, notOk, equal, notEqual, equalStrict, notEqualStrict, type
}
