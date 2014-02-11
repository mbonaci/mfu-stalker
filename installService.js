/* jshint node:true */
var nodewin = require('node-windows');
var Service = require('node-windows').Service;

nodewin.isAdminUser(function(isAdmin) {
  if (isAdmin)
    console.log('Ipak je admin!');
  else
    console.log('Ipak NIJE admin!');
});


// Create a new service object
var svc = new Service({
  name        : 'Datacap MFU pre-processor',
  description : 'Servis za obradu (pripremu za Datacap) dokumenata skeniranih na multi-funkcijskim uredjajima (MFU).',
  script      : 'C:\\SVGroup\\apps\\mfu-stalker-chokidar\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
  svc.start();
});

// Just in case this file is run twice.
svc.on('alreadyinstalled', function(){
  console.log('Servis je vec instaliran.');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start', function(){
  console.log(svc.name + ' started!');
});

svc.on('uninstall', function() {
  console.log('service uninstalled!');
});

svc.on('error', function(err) {
  console.log(svc.name + " error: ", err);
});
  


svc.install();