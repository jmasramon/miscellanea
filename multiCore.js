const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  var numReqs = 0;
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    console.log('forking one more worker');
    var worker = cluster.fork();
    worker.on('exit', (code, signal) => {console.log('I, the worker exited from signal', signal, 'with code', code)});
  }

  Object.keys(cluster.workers).forEach((id) => {
    cluster.workers[id].on('message', msg => {
      if (msg.cmd && msg.cmd == 'notifyRequest') {
        numReqs += 1;
        console.log('new request; total:', numReqs);
      }
    });
  });

  console.log('# of workers:', Object.keys(cluster.workers).length);
  console.log('cluster.workers', cluster.workers); 

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  var numReqs = 0;
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world from worker ' + cluster.worker.id+ '\n');
    process.send({ cmd: 'notifyRequest' });
    numReqs += 1;
    console.log('woker', cluster.worker.id, 'request count:', numReqs);
    if (numReqs === 3){ 
      console.log('woker', cluster.worker.id,'Done! Bye!'); 
      cluster.worker.disconnect();
    }
  }).listen(8000);

  console.log('worker', cluster.worker.id,'listening');
}