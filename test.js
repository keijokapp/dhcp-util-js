require('babel/register');
var assert = require('./assert');

var Dog = function(name) {
	this.id = 'Dog '+name;
}.schema('string');

var Cat = function(name) {
	this.id = 'Cat '+name;
}.schema('string');

var a = function() {}.schema(['null', Dog]);

var Asd = function(a) {}
.schema({
	b: 'null'
}).constructor()

var asd = new Asd({b: null});

console.log(asd instanceof Asd);

