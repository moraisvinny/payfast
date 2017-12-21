var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

if(cluster.isMaster) {
    cpus.forEach(function(){
        cluster.fork();
    });

    cluster.on('listening', worker => {
        console.log("cluster %d conectado", worker.process.pid);
    });

    cluster.on('exit', worker => {
        console.log("cluestar %d desconectado", worker.process.pid);
        cluster.fork();
    } )
} else {
    require('./index');
}
