var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name        : 'Datacap MFU pre-processor',
  description : 'Servis za obradu (pripremu za Datacap) dokumenata skeniranih na Multi Funkcijskim Uređajima (MFU).',
  script      : 'D:\\Downloads\\mfu-stalker-chokidar\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
  svc.start();
});

svc.install();