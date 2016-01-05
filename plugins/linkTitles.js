/* Get title of pages linked to in chat */

'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  "message": {
    "regex": /(https?\:\/\/)?((?:www)?\S*\.\S*)/i,
    "handler": function (params) {
      var result = params.result;
      var callback = params.callback;
      var url = (params.result[1] ? params.result[1] + params.result[2] : 'http://' + params.result[2]);

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);
          var title = $('title').text();
          callback('[T] ' + title);
        }
      });
    }
  }
}
