var myCluster = require('./node_modules/cluster'), 
	app = require('./app');

console.log('required cluster:', myCluster);

myCluster(app)
  .use(myCluster.logger('logs'))
  .use(myCluster.stats())
  .use(myCluster.pidfiles('pids'));ç
  .use(myCluster.cli())
  .use(myCluster.repl(8888))
  .listen(3000);