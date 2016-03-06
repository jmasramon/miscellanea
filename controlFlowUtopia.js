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

////////////////////// forbes way //////////////////////
function async2(makeGenerator){
  return function (){
    var generator = makeGenerator.apply(this, arguments);
    
    function handle(result){ // { done: [Boolean], value: [Object] }
      if (result.done) return result.value;
      
      return result.value.then(function (res){
        return handle(generator.next(res));
      }, function (err){
        return handle(generator.throw(err));
      });
    }
    
    return handle(generator.next());
  };
}

var readJSON = async2(function *(filename){
  return JSON.parse(yield fs.readFileAsync(filename, 'utf8'));
});

// you can combine(chain) them 
var get = async2(function *(){
  var left = yield readJSON('user.json');
  var right = yield readJSON('user2.json');
  return {left: left, right: right};
});

var getParallel = async2(function *(){
  var left = readJSON('user.json');
  var right = readJSON('user2.json');
  return {left: yield left, right: yield right};
});

var getMany = async2(function *() {
	let results = [];
	for (let file of fileList2) {
		try {
			results.push(yield readJSON(file));
		} catch(e) {
			results.push(e.message);
		}
	}
	return results;
});

// no side effects but still returning a promise
get().then(function(res) {
	console.log('forbesian:', res.left);
	console.log('forbesian:', res.right);
});

getParallel().then(function(res) {
	console.log('forbesian parallel:', res.left);
	console.log('forbesian parallel:', res.right);	
});

getMany().then(function(results) {
	for (let res of results) {
		console.log('forbesian for:', res);
	}	
});

// but, really, no need to work with promises directly
(async2(function *() {
	let rAndl = yield get();
	console.log('forbesian 2:', rAndl.left);
	console.log('forbesian 2:', rAndl.right);
	
	rAndl = yield getParallel();
	console.log('forbesian parallel 2:', rAndl.left);
	console.log('forbesian parallel 2:', rAndl.right);	

	let results = yield getMany();
	for (let res of results) {
		console.log('forbesian for 2:', res);
	}	

}))();







