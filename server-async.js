/* jshint node:true */
var chokidar  = require('chokidar'),
    fs        = require('graceful-fs'),
    util      = require('util'),
    path      = require('path'),
    xmlReader = require('./xmlReader');

var WATCH_DIR     = path.normalize('D:/Downloads/mfu/watch');
var PROCESSED_DIR = path.normalize('D:/Downloads/mfu/processed');

var watcher = chokidar.watch(WATCH_DIR, {ignored: /^\./, persistent: true});

watcher
  .on('add', function(xmlPath) {
  if (path.extname(xmlPath) !== '.xml') return;
  
  var processXml = PROCESSED_DIR + path.sep + path.basename(xmlPath);
  
  console.log('\n##############################################################################');
  console.log('XML:\t\t' + xmlPath);
  console.log('##############################################################################');
  
  // izvuci atribute iz premještenog XML-a
  xmlReader.getXmlData(xmlPath, function(res) {
    //console.log('xml data:\n\t' + JSON.stringify(res));
    
    // zamijeni dvotočke točkama u nazivu foldera (zbog windowsa/time-a)
    var adjTime = res.time.replace(/:/g , ".");
    
    // kreiraj novi processed subdir s podacima iz XML-a
    var newDir = PROCESSED_DIR + path.sep + adjTime + '--' + res.host + '--' + res.user;
          
    fs.mkdir(newDir, function(err) {
      if (err) util.error(err);
      // prvo premjesti XML, inače će ga opet procesirati čim maknem prvi tif
      // mora biti sync, inače ga uhvati prvi next tick prije nego stignem premjestiti
      fs.renameSync(xmlPath, processXml);
        
      // provjeri da li je xml uspješno premješten
      if(!fs.existsSync(processXml)) { //, function(err, exists) {        
        util.debug('premještanje xml-a "' + xmlPath + '" nije uspjelo!');
        
      } else {
        console.log('xml premješten:\t' + processXml);
        
        for(var img in res.images) {
          var imgFileName = res.images[img];
          var oldPath = WATCH_DIR + path.sep + imgFileName;
          var newPath = newDir    + path.sep + imgFileName;
          console.log('stara putanja:\t'     + oldPath);
          console.log('nova putanja:\t'      + newPath);
          
          fs.rename(oldPath, newPath, cb); // async je ovdje OK
        }
      }
    });
  });
})
  .on('change', function(path) {console.log('File', path, ' je promijenjen');})
  .on('unlink', function(path) {console.log('File', path, ' je uklonjen');})
  .on('error', function(error) {util.error('Nepoznata greška. Damn!', error);});





// ovo je da izbjegnem kreiranje funkcije u petlji
function cb(err) {
  if (err) util.error(err);
}
