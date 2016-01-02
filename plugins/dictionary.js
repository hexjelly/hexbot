/* Get definition of words */

'use strict';

function init (bot) {
  var regex = /^!(?:dict|define|def|dic|wikt|wt)\s+(.*)$/i;

  bot.on('message', function(from, to, text) {
    var result = regex.exec(text);
    if (result) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      dict(result[1], function (result) {
        bot.say(to, result);
      });
    }
  });

  function dict (word, callback) {
    var request = require('request');
    var url = "http://dictionaryapi.net/api/definition/" + encodeURIComponent(word);

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var dict = JSON.parse(body);
          var definition = '';
          if (dict.length > 0 && dict[0].Definitions.length > 0) {
            definition += dict[0].Word + ' (' + dict[0].PartOfSpeech + '): ';
            for (var i = 1; i < dict[0].Definitions.length + 1 && i < 5; i++) {
              definition += (i > 1 ? ', ' : '') + (dict[0].Definitions.length > 1 ? i + '. ' : '') + dict[0].Definitions[i-1];
            };

            if (definition.length > 420) {
              definition = definition.substr(0,417) + '...';
            }
            callback(definition);
          } else {
            callback("Couldn't find definition for '" + word + "'.");
          }
      }
    });
  };
};

module.exports = init;
