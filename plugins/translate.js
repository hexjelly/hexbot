/* jshint node: true */
/* Translation using Yandex API */

'use strict';

var nconf = require('nconf');
var request = require('request');

module.exports = {
  "message": {
    "regex": /^!tr\s+(?:\:([a-z]{2})\s*)?(?:\:([a-z]{2})\s*)?(.+)$/i,
    "handler": function (params) {
      var APIKey = nconf.get('plugins').translate.APIKey;
      var result = params.result;
      var from = params.from;
      var to = params.to;
      var callback = params.callback;
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
      var language = (result[1] && !result[2] ? result[1] : (result[2] ? result[1] + '-' + result[2] : 'en'));
      var translateText = result[3];
      var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + APIKey + "&text=" + encodeURIComponent(translateText) + "&lang=" + language + "&options=1";

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          if (body.code == 200) {
            callback.say(to, from + ', ' + body.text);
          } else {
            callback.say(to, from + ', ' + body.code + ': ' + codes[body.code]);
          }
        } else {
          callback.say(to, from + ", couldn't connect to translation API. Server responded with code " + response.statusCode);
        }
      });
    }
  }
};
