/* jshint node: true */
/* Retrieve IMDB title, year and rating */

'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  "message": {
    "regex": /^!imdb\s(.*)|.*imdb\.com\/title\/tt(\d{7}).*/i,
    "handler": function (params) {
      var callback = params.callback;
      var to = params.to;
      if (params.result[1]) {
        searchIMDb(params.result[1], callback);
      } else if (params.result[2]) {
        getIMDb(params.result[2], false, callback);
      }

      function getIMDb (tt, link, callback) {
        var url = 'http://akas.imdb.com/title/tt' + tt;
        var titleregex = /^(.*)\s(\(.*\))\s-\sIMDb$/;

        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var result = titleregex.exec($('title').text());
            var name = result[1] || 'Unknown';
            var year = result[2] || '(????)';
            var rating = $('span[itemprop=ratingValue]').text() || '?';
            callback.say(to, "[IMDb] " + name + " " + year + " - " + rating + "/10" + (link ? " http://www.imdb.com/title/tt" + tt + "/" : ""));
          }
        });
      }

      function searchIMDb (search, callback) {
        var url = "http://www.imdb.com/find?q=" + encodeURIComponent(search) + "&s=tt";

        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var searchResult = /tt(\d{7})/.exec($('td.result_text a').attr('href'));
            if (searchResult) {
              getIMDb(searchResult[1], true, callback);
            } else {
              callback.say(to, "No search results for '" + search + "'.");
            }
          }
        });
      }
    }
  }
};
