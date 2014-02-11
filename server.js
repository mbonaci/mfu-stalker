/* jshint node:true */
'use strict';
var chokidar  = require('chokidar'),
    fs        = require('graceful-fs'),
    util      = require('util'),
    path      = require('path'),
    mv        = require('mv'),
    xmlReader = require('./xmlReader');

var WATCH_DIR     = 'D:\\DatacapIngestion\\FromMFU';        // ovdje MFU stavlja slike
var PREPARED_DIR  = 'D:\\DatacapIngestion\\SCANPrepared';   // ovdje premještam slike
var PROCESSED_DIR = 'D:\\DatacapIngestion\\SCANProcessed';  // ovdje premještam obrađene XML-ove

var watcher = chokidar.watch(WATCH_DIR, {persistent: true}),
    LRU = require("lru-cache"),
    lru = LRU(100),   // set the max size the cache can reach
    fn;               // just the file name portion of the full path we get from chokidar


watcher
  .on('add', function _add(xmlPath) {

     fn = path.basename(xmlPath);

    if (!lru.get(fn)) {
      lru.set(fn, "true");
      console.log("added file name to cache: ", fn);
    } else {
      console.log("već je obrađen: ", fn);
      return;
    }

    if (path.extname(xmlPath) !== '.xml') {
      console.log(new Date().toISOString(new Date()) + '\tIgnoriram:\t' + xmlPath);
      return;
    }

    console.log(new Date().toISOString(new Date()) + '\tXML:\t\t\t\t' + xmlPath);

    // formiraj odredišni direktorij za XML file (zadrži naziv poslovnice)
    var processXml = xmlPath.replace(WATCH_DIR, PROCESSED_DIR);
    //console.log("Processed xml path:\t" + processXml);

    // izvuci atribute iz premještenog XML-a
    xmlReader.getXmlData(xmlPath, function _getXmlData(res) {
      console.log('\n##################################################################');
      console.log('XML:\t\t' + xmlPath);
      console.log('##################################################################');

      // zamijeni dvotočke točkama u nazivu foldera (zbog windowsa/time-a)
      var adjTime = res.time.replace(/:/g , ".");

      // kreiraj novi prepared (for DC) subdir s podacima iz XML-a
      var newDir = PREPARED_DIR + path.sep + adjTime + '--' + res.host + '--' + res.user;

      console.log("source path: ", xmlPath);
      console.log("destination path: ", processXml);

      mv(xmlPath, processXml, {mkdirp: true}, function(err) {
        if (err) {
          console.err("puklo gore: ", err);
        }

        var imgCnt = res.images.length,
            i = 0;

        // izvuci file path-ove od slika i premjesti ih u novi folder
        res.images.forEach(function(img) {

          var oldPath = xmlPath.replace(path.basename(xmlPath), img);
          var newPath = newDir + path.sep + img;
          console.log('stara putanja:\t' + oldPath);
          console.log('nova putanja:\t' + newPath);

          // premjesti sliku u processed folder (Datacap prepared folder)
          mv(oldPath, newPath, {mkdirp: true}, function(err) {
            if (err) {
              console.err("puklo dole: ", err);
            }
          });
        });
      });
    });
  })
  .on('unlink', function _unlink(path) { console.log('File ', path, ' je uklonjen');})
  .on('error',  function _error(error) { console.log('Chokidar: Nepoznata greška.', error);});
