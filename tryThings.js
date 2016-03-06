/* jshint esnext: true*/
var Things = [1, 2, 3, 4, 5],
    funcs = [];

function mapLike(f, Things) {
    var i,funcs = [];

    for (i = Things.length - 1; i >= 0; i--) {
    		var num = i;
        console.log(i, Things[i], Things.length-i-1);

        funcs.push((function (num) {
        	return (() => f(Things[num+1]));
        })(i));

        // funcs.push(() => f(Things[num+1]));
        console.log(funcs[Things.length-i-1]);
        console.log(funcs[Things.length-i-1](i));
    }
    console.log('i:',i);
    return funcs;
}

var res = mapLike(i => i * i, Things);

console.log(res);

for (var i in res) {
    console.log(res[i]());
}
