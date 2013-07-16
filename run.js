/**
 * File: server.js
 * Author: Jonathan Sawyer
 * Copyright: 2013 Jonathan Sawyer <jonmsawyer@gmail.com>
 * License: MIT License
 */

// Requires
var nconf = require("nconf");
var sys = require("util");
var lineReader = require("line-reader");
var S = require("string"); // for trim
var rules = require("./rules");

nconf.argv().env().file({ file: 'config.json' })

var file = nconf.get("word:file");
var parseSpeed = 200; // one line per N milliseconds (1 = fast; 1000 = slow)

function parseLine(line, last, callback) {
    var l = S(line).trim().s;
    sys.puts(l);
    var parts = l.split("\t");
    var id = parseInt(parts[0]);
    try {
        var sentence = S(parts[1]).trim().s;
    }
    catch(e) {
        var sentence = "";
    }
    
    if (id === 0) {
        sys.puts("DEBUG ===> User is robot, skipping.");
    } else {
        rules.forEach(function(rule) {
            var results = rule[0].exec(sentence);
            if (results) {
                sys.puts("DEBUG ===> Chat filter found " + results[1] + ", replacing with " + rule[1]);
                sys.puts(id + "\t" + sentence.replace(rule[0], rule[1]));
            }
        });
    }
    if (last) {
        return false;
    }

    callback();
}

function getLine(line, last, callback) {
    setTimeout(function() {
        parseLine(line, last, callback);
    }, parseSpeed);
}

function doIt(fileName) {
    sys.puts("Parsing " + fileName + "...");
    lineReader.eachLine(fileName, getLine);
}

sys.puts("Opening " + file + "...");
doIt(file);

