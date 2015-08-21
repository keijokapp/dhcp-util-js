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

		type = function(value, type) {
			if(!type) continue;
			var type = typeof type === 'object' ? type : [ type ];
			var found = false;
			for(var i = 0; i < type.length && !found; i++) {
				switch(type[i]) {
				case 'undefined':
				case 'number':
				case 'boolean':
				case 'string': found = typeof arguments[i] === type[i]; break;
				case 'null': found = arguments[i] === null; break;
				case 'int': found = parseInt(value) === value; break;
				case 'uint': found = parseInt(value) === value && value >= 0; break;
				default:
					if(type[i] instanceof Function)
						found = arguments[i] instanceof type[i];
					else {
						for(var ii in type[i]) {
							type([ii][i], type[i]);
						}
					}
				}
			}
			if(!found) throw new TypeError('expected ' + JSON.stringify(type) + ', got ' + JSON.stringify(value));
		},


		functionSchema = function() {
			var _this = this;
			var _arguments = arguments;
			return function() {
				for(var i = 0, l = _arguments.length; i < l; i++) {
					type(arguments[i], _arguments[i]);
				}
				return _this.apply(this, arguments);
			}
		};


Object.defineProperty(Function.prototype, 'schema', {
	enumerable: false,
	value: functionSchema
});

export {
	ok, notOk, equal, notEqual, equalStrict, notEqualStrict, type
}
