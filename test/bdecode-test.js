buster.testCase("Bdecode Tests", {
	"Positive number": function () {
		var input = str2ab('i123e');
		var output = 123;
		assert.equals(bdecode(input),output);
	},

	"Negative number": function () {
		var input = str2ab('i-23e');
		var output = -23;
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	},

	"Simple String": function (){
		var input = str2ab('3:foo');
		var output = str2ab('foo');
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	},

	"String with double digit length": function(){
		var input = str2ab('11:jakoblandbo');
		var output= str2ab('jakoblandbo');
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	},

	"Empty List": function(){
		var input = str2ab('le');
		var output = [];		
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	},

	"Non Empty List": function(){
		var input = str2ab('li123e11:jakoblandboi-52ee')
		var output= new Array(123,str2ab('jakoblandbo'),-52);
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	},

	"Empty Dir": function(){
		var input = str2ab('de');
		var output = {};
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	},

	"Simple Dir with number": function(){
		var input = str2ab('d5:jakobi123ee');
		var output = { jakob: 123 };
		var result = bdecodeWithOffset(input,0);
		assert.equals(result.value,output);
		assert.equals(result.offset,input.length);
	}
})	
