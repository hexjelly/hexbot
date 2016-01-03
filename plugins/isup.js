/* Check if website is up */

'use strict';

function init (bot) {
  // extremely naive barebones check of URI as we're passing it to request module anyway
  // basically just checks if anything matches *.* with optional http or https infront and ignores missing : or / characters
  var regex = /^!isup\s+(?:https|http)?(?:\:|\/)*(.+\..+)/i;

  bot.on('message', function (from, to, text) {
    var result = regex.exec(text);
    if (result) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      isUp(result[1], function (result) {
        bot.say(to, result);
      });
    }
  });

  function isUp (url, callback) {
    var request = require('request');
    var testURI = 'http://' + url;

    request(testURI, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(testURI + ' seems to be up!');
      } else {
        callback(testURI + ' is down for me as well');
      }
    });
  };
};

module.exports = init;
