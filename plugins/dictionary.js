/* jshint esversion: 6, node: true */
/* Get definition of words */

'use strict';

const nconf = require('nconf');
const request = require('request');
const util = require('util');

module.exports = {
  "message": {
    "regex": /^!(?:dict|define|def|dic|wikt|wt)\s+(.*)$/i,
    "handler": function dict(params) {
      let word = params.result[1];
      let to = params.to;
      let callback = params.callback;

      let APIKey = nconf.get('plugins').dictionary.APIKey;
      let url = "http://api.wordnik.com:80/v4/word.json/" + encodeURIComponent(word) + "/definitions?limit=3&includeRelated=false&sourceDictionaries=wiktionary%2Cwebster&useCanonical=true&includeTags=false&api_key=" + APIKey;

      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let definition;
          body = JSON.parse(body);

          if (body.length > 0) {
            definition = body[0].word + ' - ';
            for (let n = 1; n < body.length + 1; n++) {
              definition += n + ": " + body[n-1].text + ' ';
            }
          }

          if (definition) {
            if (definition.length > 420) {
              definition = definition.substr(0,417) + '...';
            }
            callback.say(to, definition);
          } else {
            callback.say(to, "Couldn't find definition for '" + word + "'.");
          }
        } else if (error) {
          util.log(error);
        }
      });
    }
  }
};
