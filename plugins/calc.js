/* Calculator evalution */

'use strict';

function init (bot) {
  var regex = /^!(?:calc|c)\s+(.+)/i;

  bot.on('message', function (from, to, text) {
    var result = regex.exec(text);
    if (result) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      };
      calculate(result[1], from, function (result) {
        bot.say(to, result);
      });
    }
  });

  function calculate (text, from, callback) {
    var math = require('mathjs');
    try {
      var calculationResult = math.format(math.eval(text), {precision: 14});
      callback(from + ', ' + calculationResult);
    } catch(error) {
      callback(from + ', Error: Dunno.');
    }
  };
};

module.exports = init;
