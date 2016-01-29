function showRecursionImpact(fn, args) {
    fn.apply(null, args);
}


var indenting = 0;
var fibStr = '';

fib.accumulated = '';

function fib(n) {
    console.log(fib.accumulated + ' -> fib(' + n + ')');
    if (n === 0) {
        console.log(fib.accumulated + ' -> 0');
        return 0;
    }
    if (n === 1) {
        console.log(fib.accumulated + ' -> 1');
        return 1;
    }
    fib.accumulated += ' -> fib(' + (n - 1) + ') + fib(' + (n - 2) + ')';
    return fib(n - 1) + fib(n - 2);
}

function fibTailRec(n, n2, n1) {
    console.log(n, n2, n1);
    if (n === 2) return n2 + n1;
    return fibTailRec(n - 1, n1, n2 + n1);
}

console.log(fib(7));
console.log(fibTailRec(7, 0, 1));

recSum.accumulated = '';

function recSum(n) {
    console.log(recSum.accumulated + 'recsum(' + n + ')');
    if (n == 1) {
        console.log(recSum.accumulated + ' + 1');
        return 1;
    }
    recSum.accumulated += (n + ' + ');
    return n + recSum(n - 1);
}

function recSumTailRec(n, acc) {
    console.log(n, acc);
    if (n == 1) return acc + 1;
    return recSumTailRec(n - 1, acc + n);
}



console.log(recSum(10));
console.log(recSumTailRec(10, 0));
