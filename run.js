/**
 * File: server.js
 * Author: Jonathan Sawyer
 * Copyright: 2013, Jonathan Sawyer <jonmsawyer@gmail.com>
 * License: MIT License
 */

// Requires
var nconf = require("nconf");
var sys = require("util");
var lineReader = require("line-reader");
var S = require("string"); // for trim
var rules = require("./rules");

// Obtain the configuration for this app. Requires 'nconf'.
nconf.argv().env().file({ file: 'config.json' })

// The file that is parsed.
var file = nconf.get("word:file");

// The parse speed. In milliseconds. 1 = fast. 1000 = slow.
var parseSpeed = 200;

/**
 * Function: parseLine
 *
 * Parse individual lines of text.
 *
 * Parameters:
 * line - {string} The line of text to parse
 * last - {boolean} This is true with the last line of text has been parsed
 * callback - {function} The callback
 */
function parseLine(line, last, callback) {
    // trim our line of whitespace before splitting it up
    var l = S(line).trim().s;

    sys.puts(l);

    // parts should contain 2 items: ["id", "data"]
    var parts = l.split("\t");

    // since "id" is a string and we know it's an integer string, parse the id
    // to an integer.
    var id = parseInt(parts[0]);

    // we wrap this in a try statement in case of lines such as "1234\t" where
    // when split by a \t characters, the array "parts" contains only one
    // element
    try {
        // grab the sentence to run our chat filter on and trim it of
        // whitespace
        var sentence = S(parts[1]).trim().s;
    }
    catch(e) {
        var sentence = "";
    }
    
    // Assumption: the id of 0 is the chatroom robot and does not need to be
    // filtered
    if (id === 0) {
        sys.puts("DEBUG ===> User is robot, skipping.");
    } else {
        // each rule is contained in rules.js; rule is a 2-tuple containing
        // the regular expression to search by and the replacement text like
        // this: [/regex/, "replacement text"].
        //
        // TODO: this crude loop does not take into account that two separate
        // pieces of offending material could be used in the same sentence,
        // upgrade this routine to complete all parsing before sending back
        // replaced text to the user.
        rules.forEach(function(rule) {
            // we know rule[0] is a regular expression
            var results = rule[0].exec(sentence);
            
            if (results) {
                sys.puts("DEBUG ===> Word Filter found " + results[1] + ", replacing with " + rule[1]);
                // this is a proof of concept showing what text would be
                // replaced.
                sys.puts(id + "\t" + sentence.replace(rule[0], rule[1]));
            }
        });
    }

    // return false when we've parsed the last piece of data
    if (last) {
        return false;
    }
    
    callback();
}

/**
 * Function: getLine
 *
 * Callback method for the line-reader module's 'eachLine'. Called for each
 * line of a file.
 *
 * We wrap parseLine around a setTimeout function to control how quickly
 * the data is parsed. Not needed in a real production environment, but is used
 * to help the human read the data in a slower way.
 *
 * Parameters:
 * line - {string} The line as given by line-reader
 * last - {boolean} This is true when the last line has been sent
 * callback - {function} The callback
 */
function getLine(line, last, callback) {
    setTimeout(function() {
        parseLine(line, last, callback);
    }, parseSpeed);
}

/**
 * Function: doIt
 *
 * Our main method called to start the program.
 *
 * Parameters:
 * fileName - {string} The name of the chat log to parse
 */
function doIt(fileName) {
    sys.puts("Parsing " + fileName + "...");
    lineReader.eachLine(fileName, getLine);
}

// Do it.
sys.puts("Opening " + file + "...");
doIt(file);

