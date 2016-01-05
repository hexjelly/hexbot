/* Get etymology information */

'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  "message": {
    "regex": /^!etym?\s+([^:]+)(?:\s+\:(.+))?$/i,
    "handler": function (params) {
      var word = params.result[1];
      var modifier = params.result[2];
      var callback = params.callback;

      var url = 'http://www.etymonline.com/index.php?allowed_in_frame=0&term=' + encodeURIComponent(word);

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var term;
          var definition;
          var $ = cheerio.load(body);
          if (modifier) {
            var search = word + modifier;
            $('dt').each(function (i, elem) {
              if ($(this).text().replace(/\W/g, '').toLowerCase() == search.replace(/\W/g, '').toLowerCase()) {
                  term = $(this).children('a').eq(0).text();
                  definition = $(this).next().text();
              }
            });
          } else {
            term = $('dt').eq(0).children('a').eq(0).text();
            definition = $('dd').eq(0).text();
          }

          if (term && definition) {
            var result = term + ': ' + definition;
            if (result.length > 420) {
              result = result.replace(/(?:\r\n|\r|\n)/g, '').substr(0,416-url.length) + '... ' + url;
            }
            callback(result);
          } else {
            callback("Couldn't find entry for '" + word + "'.");
          }
        }
      });
    }
  }
}
