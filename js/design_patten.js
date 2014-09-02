// JavaScript Document
/*Class Person*/
var Person = {
	name:'default name',
	getName:function(){
		return this.name;
		}
	}
alert(Person.constructor.prototype)
var reader = clone(Person);
alert(reader.getName());
function clone(object){
	function F(){};
	F.prototype = object;
	return new F;
	}
