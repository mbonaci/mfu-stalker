/* jshint node:true */
'use strict';
var fs = require('graceful-fs'),
    parser = require('./xmlParser');

var DELAY_WAIT_FOR_LAST_IMAGE = 3000; // ms
var scanData = {};

exports.getXmlData = function(xmlFileName, callback) {

  // namjerno radim delay da dam vremena zadnjoj slici da stigne do kraja
  // xml je 1KB, a slika i preko 100k
  setTimeout(function _delayedParser() {
    parser.getJson(xmlFileName, function(data) {

      //console.log('getJson returned:\n' + data);

      scanData.user = data.indexfile.username[0];
      console.log('user:\t\t' + scanData.user);
      //scanData.ip = data.indexfile.device[0].ipaddress[0];
      //console.log('ip:\t\t' + scanData.ip);
      scanData.host = data.indexfile.device[0].hostname[0];
      console.log('host:\t\t' + scanData.host);
      scanData.time = data.indexfile.datetime[0];
      console.log('time:\t\t' + scanData.time);
      scanData.images = data.indexfile.scanfiles[0].file;

      callback(scanData);
    });
  }, DELAY_WAIT_FOR_LAST_IMAGE);
};
