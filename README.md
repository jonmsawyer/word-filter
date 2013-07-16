Word Filter
===========

Word Filter reads in a file of your choosing, filtering and replacing
words according to the configured set of rules. This is a very quick and
crude approach.

Dependencies
============

This project uses Node:

    URL: http://nodejs.org/download/

To install dependencies, use NPM:

    $ [sudo] curl http://npmjs.org/install.sh | sh

Requires:

 * `string` for trimming strings
 * `nconf` for configuration
 * `line-reader` to read in and parse a chat log

    $ [sudo] npm install

Configuration
=============

File: config.json

Options
-------
* word:file - a string containing the chat log or word list to filter

Run the app
===========

    $ node run

