/* Calculator evalution */

'use strict';

function init (bot) {
  var regex = /^!(calc|c)\s+(.+)/i;

  bot.on('message', function(from, to, text) {
    var result = regex.exec(text);
    if (result) {
      calculate(result[2], to, from);
    }
  });

  function calculate(text, to, from) {
    var math = require('mathjs');
    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    try {
      var calculationResult = math.format(math.eval(text), {precision: 14});
      bot.say(to, from + ', ' + calculationResult);
    } catch(error) {
      bot.say(to, from + ', Error: Dunno.');
    }
  };
};

module.exports = init;
