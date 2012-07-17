buster.testCase("Bencode Tests", {

	"String comparison": function () {
		var input = str2ab('foo');
		var output = str2ab('3:foo');
		assert.equals(bencode(input),output);
	},

	"String with double digit length": function(){
		var input = str2ab('jakoblandbo');
		var output = str2ab('11:jakoblandbo');
		assert.equals(input.length,11);
		assert.equals(output.length,14);
		assert.equals(bencode(input).length,14);
		assert.equals(bencode(input),output);
	},

	"Positive Integer": function () {
		var input = 123;
		var output = str2ab('i123e');
		assert.equals(bencode(input),output);
	},

	"Negative Integer": function () {
		var input = -52;
		var output = str2ab('i-52e');
		assert.equals(bencode(input),output);
	},

	"Empty List": function () {
		var input = new Array();
		var output = str2ab('le');
		assert.equals(bencode(input),output);
	},

	"Non-Empty List": function(){
		var input = new Array(123,str2ab('jakoblandbo'),-52);
		var output = str2ab('li123e11:jakoblandboi-52ee')
		assert.equals(bencode(input),output);
	},

	"Empty Dir": function(){
		var input = {};
		var output = str2ab('de');
		assert.equals(bencode(input),output);
	},

	"Simple Dir with number": function(){
		var input = { jakob: 123 };
		var output = str2ab('d5:jakobi123ee');
	},

	"Simple Dir with string": function(){
		var input = { jakob: "foo" };
		var output = str2ab('d5:jakob3:fooe');
	},
	
	"Dir with string and number": function(){
		var input = { jakob: 123, linda: str2ab('foo')  };
	 	var output = str2ab('d5:jakobi123e5:linda3:fooe');
		assert.equals(bencode(input),output);
	},

	"Non-Empty Dir": function(){
		var input = { jakob: 123, linda: -52, foo: str2ab('bar') };
	 	var output = str2ab('d5:jakobi123e5:lindai-52e3:foo3:bare');
		assert.equals(bencode(input),output);
	}
})
