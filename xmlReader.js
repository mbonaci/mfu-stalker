/* jshint node:true */
var fs = require('graceful-fs'),
    parser = require('./xmlParser');

var scanData = {};

exports.getXmlData = function(xmlFileName, callback) {

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
};
