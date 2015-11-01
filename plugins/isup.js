/* Check if website is up */

'use strict';

module.exports = (function () {
  return function init(bot) {
    // extremely naive barebones check of URI as we're passing it to request module anyway
    // basically just checks if anything matches *.* with optional http or https infront and ignores missing : or / characters
    var regex = /^!isup\s+(https|http)?(:|\/)*(.+\..+)/i;

    bot.on('message', function(from, to, text) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      var result = regex.exec(text);
      if (result && result[3]) {
        isUp(result[3], bot, to); // thanks to async hell, no idea how to do this better?
      }
    });
  };

  function isUp(url, bot, to) {
    var request = require('request');
    var testURI = 'http://' + url;

    request(testURI, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        bot.say(to, testURI + ' seems to be up!');
      } else {
        bot.say(to, testURI + ' is down for me as well');
      }
    });
  };
})();
