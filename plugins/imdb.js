/* Retrieve IMDB title, year and rating */

'use strict';

function init (bot) {
  var regex = /^!imdb\s(.*)|.*imdb\.com\/title\/tt(\d{7}).*/i;

  bot.on('message', function (from, to, text) {
    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    var result = regex.exec(text);
    if (result && result[1]) {
      searchIMDb(result[1], function (result) {
        bot.say(to, result);
      });
    } else if (result && result[2]) {
      getIMDb(result[2], false, function (result) {
        bot.say(to, result);
      });
    }
  });

  function getIMDb (tt, link, callback) {
    var request = require('request');
    var cheerio = require('cheerio');
    var url = 'http://akas.imdb.com/title/tt' + tt;
    var titleregex = /^(.*)\s(\(.*\))\s-\sIMDb$/;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var result = titleregex.exec($('title').text());
        var name = result[1] || 'Unknown';
        var year = result[2] || '(????)'
        var rating = $('span[itemprop=ratingValue]').text() || '?';
        callback("[IMDb] " + name + " " + year + " - " + rating + "/10" + (link ? " http://www.imdb.com/title/tt" + tt + "/" : ""));
      }
    });
  };

  function searchIMDb (search, callback) {
    var request = require('request');
    var cheerio = require('cheerio');
    var url = "http://www.imdb.com/find?q=" + encodeURIComponent(search) + "&s=tt";

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);
          var searchResult = /tt(\d{7})/.exec($('td.result_text a').attr('href'));
          if (searchResult) {
            getIMDb(searchResult[1], true, callback);
          } else {
            callback("No search results for '" + search + "'.")
          }
      }
    });

  };
};

module.exports = init;
