var workers = {'1': { Worker: {id: 1}},'2': { Worker: {id:2}},'3': {Worker: {id:3}},'4': {Worker: {id:4}},kk:5}; 

console.log('for loop ********************');
for (var id in workers) {
	console.log('id:', id);
	console.log('workers.hasOwnProperty('+id+')', workers.hasOwnProperty(id));
    if (workers.hasOwnProperty(id)) {
        console.log(workers[id]); 
    }
}
console.log('applicative programming *************');
workers.filter(worker => worker.hasOwnProperty('id')).forEach(woker => console.log(woker));