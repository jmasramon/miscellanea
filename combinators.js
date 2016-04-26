'use strict';
/* jshint esversion: 6 */
/* global console */

const famous = [
	{name:'Einstein', occupation: 'Physic'},
	{name:'Messi', occupation:'Soccer player'},
	{name:'Van Gogh', occupation:'painter'},
];

let pluck = (collection, property) => collection.map(elem => elem[property]);

console.log(pluck(famous, 'name'));
console.log(pluck(famous, 'occupation'));

// Decomposition: make elements of an algorithm (functions) explicit

let pluckFrom = collection => property => pluck(collection, property);

console.log(pluckFrom(famous)('name'));

let pluckWith = property => collection => pluck(collection, property);

console.log(pluckWith('name')(famous));

let leftApply = (fn, a) => b => fn(a, b);

let pluckFromBis = collection => leftApply(pluck, collection);

console.log(pluckFromBis(famous)('name'));

let pluckFromBBis = leftApply(leftApply, pluck);

console.log(pluckFromBBis(famous)('name'));

let pluckFromBBBis = leftApply(leftApply, leftApply)(pluck);

console.log(pluckFromBBBis(famous)('name'));

let rightApply = (fn, b) => a => fn(a, b);

let pluckWithBis = property => rightApply(pluck, property);

console.log(pluckWithBis('name')(famous));

let pluckWithBBis = leftApply(rightApply, pluck); // pluck still needs to be the first param to right apply

console.log(pluckWithBis('name')(famous));

let pluckWithBBBis = leftApply(leftApply, rightApply)(pluck); // idem

console.log(pluckWithBBBis('name')(famous));

// Generaized into combinators

let I = a => b => c => a(b,c);
let C = a => b => c => a(c,b);

let pluckFromBBBBis = I(pluck);
let pluckWithBBBBis = C(pluck);

console.log(pluckFromBBBBis(famous)('name'));
console.log(pluckWithBBBBis('name')(famous));

let get = (object, property) => object[property];

let getWith = C(get); // decomposition of get (it signature; it parameter list) 
					  // that names a part: the with tells "give me the property"
let nameOf = getWith('name');	// names a part (Of; give me the object) and specifies
								// another (name; has been set as property) 
console.log(nameOf({name:'Einstein', occupation: 'Physic'}));

let map = (collection, fn) => collection.map(fn);
let mapWith = C(map);
let namesOf = mapWith(nameOf);

console.log(namesOf(famous));

// Composition: make relationships between elements of an algorithm (functions) explicit

let compose = (a, b) => c => a(b(c)); // two functions with compatible params-outputs

let repluckWith = compose(mapWith, getWith);
let renamesOf = repluckWith('name');

console.log(renamesOf(famous));

let mix = (...ingredients) => console.log('mixing:', ...ingredients);

mix('flour', 'milk', 'eggs');

let bake = () => console.log('baking ...');
let cool = () => console.log('cooling ...');

let makeBread = (...ingredients) => {
	mix(...ingredients);
	bake();
	cool();
};

makeBread('flour', 'milk', 'eggs');

let before = (fn, decoration) => (...args) => { // to make time relationship explicit
	decoration(...args);
	fn(...args);
};

let bakeBread = before(bake, mix);
bakeBread('flour', 'milk', 'eggs');

let makeBreadBis = before(cool, bakeBread);
makeBreadBis('flour', 'milk', 'eggs');

let after = (fn, decoration) => (...args) => { // idem
	fn(...args);
	decoration(...args);
};

let makeBreadBBis = after(bakeBread, cool);
makeBreadBBis('flour', 'milk', 'eggs');

// decomposing the compositioners

let beforeWith = decoration => fn => before(fn, decoration);
beforeWith(mix)(bake)('flour', 'milk', 'eggs');

let beforeWithBis = decoration => rightApply(before, decoration);
let mixBefore = beforeWith(mix);
let mixBeforeBake = mixBefore(bake);
mixBeforeBake('flour', 'milk', 'eggs');

let beforeWitBBis = C(before);
let mixBeforeBis = beforeWitBBis(mix);
let mixBeforeBakeBis = mixBeforeBis(bake);
mixBeforeBakeBis('flour', 'milk', 'eggs');

console.log('---------');
let bakeBefore = beforeWitBBis(mixBeforeBakeBis); // nestable
let bakeBeforeCool = bakeBefore(cool);
bakeBeforeCool('flour', 'milk', 'eggs');

console.log('---------');
let afterWith = C(after);
let bakeAfter = afterWith(bake);
let bakeAfterMix = bakeAfter(mix);
let coolAfterBakeAfterMix = afterWith(cool)(bakeAfterMix);
coolAfterBakeAfterMix('flour', 'milk', 'eggs');
