/* jshint esnext:true,  node: true*/
'use strict';

const fs = require('fs');
const Promise = require("bluebird");
Promise.promisifyAll(fs);

//////////// sync version /////////////////////
function syncParseJson(file) {
	try{
		return JSON.stringify(JSON.parse(fs.readFileSync(file)), null, 2);
	} catch(e) {
		throw e;
	}

}

console.log('sync', syncParseJson('user.json'));


const fileList = ['user.json','kk.json','wrong.json'];

for (let file of fileList) {
	try {
		console.log('for sync', syncParseJson(file));
	} catch (e) {
		console.log('sync error ' + e.message);
	} 
	
}

// assync versioin
console.log();
console.log('*********** async ***********');
function asyncParseJson(file, callback) {
	let res;
	fs.readFile(file, function(error, result) {
		if (error) {
			callback('async error: ' + error.message, ' too late error');
		}
		try {
			res = JSON.stringify(JSON.parse(result)) + ' too late result';
		} catch (e) {
			res = 'async error ' + e.message + ' too late error';
			console.log(res);
			throw e;
		}
		callback(res);
	});
}

asyncParseJson('user.json', console.log);

// for (let file of fileList) {
// 	try {
// 		asyncParseJson(file, console.log);
// 	} catch (e) {
// 		console.log(e.message);
// 	} 
// }


/////////////////////////////////////////
/////////////// promises ////////////////

console.log('************* promisified *************');
function promisifiedParseJson(file) {
	return fs.readFileAsync(file)
		.then(JSON.parse)
		.then(JSON.stringify);
}

promisifiedParseJson('user2.json').then(console.log);

const fileList2 = ['user2.json','kk.json','wrong.json'];

for (let file of fileList2) {
	promisifiedParseJson(file)
		.then(console.log)
		.error(function(e) {
			console.log('promisified error:', e.message);
		})
		.catch(function(e) {
			console.log('promisified exception:', e.message);
		});
}

//////////////////////////////////////////
// generators

function *numbers() {
	let i = 0;
	let res;
	while(true) {
		i++;
		res = yield i;
		if(res == -1) return;
	}
}

function *take5(list) {
	var soFar = 0;
	for (let elem of list){
		if (soFar++ == 5) return elem;
		let res = yield elem;
		console.log('res:', res);
	}
}

let numGen = numbers();
for (let i = 3; i >= 0; i--) {
	console.log('numbers:', numGen.next().value);
}

for (let i of take5(numGen)){
	console.log('numbers taken:', i);
}

console.log('numbers:',  numGen.next(-1).value);
console.log('numbers:',  numGen.next().value);

///////////////////////////////////////////////
// promises + generators 

console.log('****************** utopia **********************');

function async(generator) {
	let it = generator();

	runner(it.next());

	function runner(yielded) {
		if (!yielded.done) {
			yielded.value
				.then(function(res) {
					runner(it.next(res));
				})
				.error(function(e) {
					console.log('utopian error:', e.message);
				})
				.catch(function(e) {
					it.throw(e);
				});
		} 
	}
}

function syncAssyncParseJson(file) {
	async (
		function *() {
			try {
				let content = yield fs.readFileAsync(file);
				console.log('utopian result:', JSON.stringify(JSON.parse(content),null,2));
			} catch(e) {
				console.log('utopian exception:', e.message);
			}
			return;
		});
}

syncAssyncParseJson('user.json');
for (let file of fileList2) {
	syncAssyncParseJson(file);
}

