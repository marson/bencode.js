var config = module.exports;

config["Bencode Tests"] = {
	env: "browser",    
	rootPath: "../",
	sources: [
		"src/bencode.js" 
	],
	tests: [
		"test/*-test.js"
	]
}

