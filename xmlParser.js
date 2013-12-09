/* jshint node:true */
var fs = require('graceful-fs');
var Parser = require('xml2js').Parser;
//var util = require('util');

var parser = new Parser();

exports.getJson = function(xmlFileName, callback) {
  
  //console.log('### xml file name:\t\t' + xmlFileName);
  
  fs.readFile(xmlFileName, function(err, data) {
    
    parser.parseString(data, function(err, result) {
      //console.dir(result);
      //console.log('inspect:\n\t' + util.inspect(result, false, null));
      
      callback(result);
    });
  });  
};
