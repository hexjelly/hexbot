/* Get definition of words */

'use strict';

function init (bot) {

  var regex = /^!(?:dict|define|def|dic|wikt|wt)\s+(.*)$/i;

  bot.on('message', function(from, to, text) {
    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    var result = regex.exec(text);
    if (result) {
      dict(result[1], to);
    }
  });

  function dict (word, to) {
    var request = require('request');
    var url = "http://dictionaryapi.net/api/definition/" + word;

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
            bot.say(to, definition);
          } else {
            bot.say(to, "Couldn't find definition for '" + word + "'.");
          }
      }
    });
  };
};

module.exports = init;
