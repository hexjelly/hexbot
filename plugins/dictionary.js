/* jshint esversion: 6, node: true */
/* Get definition of words */

'use strict';

const request = require('request');
const util = require('util');

module.exports = {
  "message": {
    "regex": /^!(?:dict|define|def|dic|wikt|wt)\s+(.*)$/i,
    "handler": function (params) {
      let word = params.result[1];
      let to = params.to;
      let callback = params.callback;
      let url = "http://dictionaryapi.net/api/definition/" + encodeURIComponent(word);

      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let dict = JSON.parse(body);
          let definition = '';
          if (dict.length > 0 && dict[0].Definitions.length > 0) {
            definition += dict[0].Word + ' (' + dict[0].PartOfSpeech + '): ';
            for (var i = 1; i < dict[0].Definitions.length + 1 && i < 5; i++) {
              definition += (i > 1 ? ', ' : '') + (dict[0].Definitions.length > 1 ? i + '. ' : '') + dict[0].Definitions[i-1];
            }

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
