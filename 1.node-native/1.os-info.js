const os = require('node:os')

console.log('Informacion del sistema operativo:')
console.log('__________________________________')

 console.log('Nombre del sistema operativo', os.platform());
 console.log('Version del sistema operativo', os.release());
 console.log('Arquitectura', os.arch());
 console.log('CPUs', os.cpus()[1].model);
 console.log('Memoria libre', os.freemem/1024/1024/1024);
 console.log('Memoria total', os.totalmem()/1024/1024/1024);
 console.log('uptime', os.uptime()/60/60);