/* jshint node: true */
/* Get definition of words */

'use strict';

var request = require('request');
var util = require('util');

module.exports = {
  "message": {
    "regex": /^!(?:dict|define|def|dic|wikt|wt)\s+(.*)$/i,
    "handler": function (params) {
      var word = params.result[1];
      var to = params.to;
      var callback = params.callback;
      var url = "http://dictionaryapi.net/api/definition/" + encodeURIComponent(word);

      request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var dict = JSON.parse(body);
          var definition = '';
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
