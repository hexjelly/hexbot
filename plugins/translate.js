/* Translation using Yandex API */

'use strict';

module.exports = (function () {
  return function init(bot, nconf) {
    var regex = /^!tr\s+:([a-z]{2})\s+(:([a-z]{2})\s+)?(.+)$/i; // --> !tr :en [:jp] text to translate
    var APIKey = nconf.get('plugins').translate.APIKey;
    // yandex API error codes
    var codes = {
      "200": "Operation completed successfully",
      "401": "Invalid API key",
      "402": "Blocked API key",
      "403": "Exceeded the daily limit on the number of requests",
      "404": "Exceeded the daily limit on the amount of translated text",
      "413": "Exceeded the maximum text size",
      "422": "The text cannot be translated",
      "501": "The specified translation direction is not supported"
    };

    bot.on('message', function(from, to, text) {
      var result = regex.exec(text);
      if (result) {
        var language = result[1] + (result[3] ? '-' + result[3] : '');
        var translateText = result[4];
        var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + APIKey + "&text=" + translateText + "&lang=" + language + "&options=1";
        translate(url, translateText, bot, to, from); // thanks to async hell, no idea how to do this better?
      }
    });
  };

  function translate(url, text, bot, to, from) {
    var request = require('request');

    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        if (body.code == 200) {
          bot.say(to, from + ', ' + body.text);
        } else {
          bot.say(to, from + ', ' + body.code + ': ' + codes[body.code]);
        }
      } else {
        bot.say(to, from + ", couldn't connect to translation API. Server responded with code " + response.statusCode);
      }
    });
  };
})();
