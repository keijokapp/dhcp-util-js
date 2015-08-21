require('babel/register');
var assert = require('./assert');

var Dog = function(name) {
	this.id = 'Dog '+name;
}.schema('string');

var Cat = function(name) {
	this.id = 'Cat '+name;
}.schema('string');

var acceptDog = function(dog) { }.schema(Dog);
var acceptDogOrCat= function(dog) { }.schema([ Dog, Cat ]);


var dog = new Dog('asd')

//console.log(dog.id);
//console.log(dog.toString());
//console.log(dog instanceof Dog);
//acceptDog(dog);
//acceptDogOrCat(dog);

var a = function() {}.schema(['null', Dog]);

a(null)
