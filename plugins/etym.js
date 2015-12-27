/* Get etymology information */

'use strict';

function init (bot) {

  var regex = /^!etym?\s+([^:]+)(?:\s+\:(.+))?$/i;

  bot.on('message', function(from, to, text) {
    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    var result = regex.exec(text);
    if (result) {
      getEtym(result[1], result[2] || null, to);
    }
  });

  function getEtym(word, modifier, to) {
    var request = require('request');
    var cheerio = require('cheerio');
    var url = 'http://www.etymonline.com/index.php?allowed_in_frame=0&term=' + encodeURIComponent(word);

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var term;
        var definition;
        var $ = cheerio.load(body);
        if (modifier) {
          var search = word + modifier;
          $('dt').each(function(i, elem) {
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
            result = result.substr(0,416-url.length) + '... ' + url;
          }
          bot.say(to, result);
        } else {
          bot.say(to, "Couldn't find entry for '" + word + "'.");
        }
      }
    });
  };
};

module.exports = init;
