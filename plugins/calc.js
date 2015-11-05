/* Calculator evalution */

'use strict';

module.exports = (function () {
  return function init(bot) {
    var regex = /^!calc\s+(.+)/i;

    bot.on('message', function(from, to, text) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      var result = regex.exec(text);
      if (result && result[1]) {
        calculate(result[1], bot, to); // thanks to async hell, no idea how to do this better?
      }
    });
  };

  function calculate(text, bot, to) {
    var math = require('mathjs');
    try {
      var calculationResult = math.format(math.eval(text), {precision: 14});
      bot.say(to, calculationResult);
    } catch(error) {
      bot.say(to, 'Error: Dunno.');
    }
  };
})();
