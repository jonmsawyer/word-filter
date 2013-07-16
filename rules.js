/**
 * File: rules.js
 * Author: Jonathan Sawyer
 * Copyright: 2013, Jonathan Sawyer <jonmsawyer@gmail.com>
 * License: MIT License
 */

/**
 * Object: rules
 *
 * rules is an array of arrays. The arrays inside the larger array contain
 * regular expression rules for word filtering in the format of
 * [regex literal, string to replace]. All rules are used to parse the input
 * of a line of characters for unwanted text and the replacement is what is
 * used to fill in the data accordingly.
 *
 * Example: [ [ /foobar/, "Foo Bar" ] ]
 * Searches a string like, "I don't like foobar" and replaces the text to
 * render "I don't like Foo Bar".
 */
rules = [
    [/(bobba)/, "Censored"],
    [/(shxts)/, "*#*#*"]
]

/**
 * Exports: Node JS rules
 *
 * Exports the 'rules' object to Node JS.
 */
exports = module.exports = rules;

