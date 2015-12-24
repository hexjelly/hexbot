/* Get Wikipedia information */

'use strict';

function init (bot) {
  var regex = /^!wiki?\s+(.+)/i;

  bot.on('message', function(from, to, text) {
    if (to === bot.nick) { // pm instead of channel
      to = from;
    }
    var result = regex.exec(text);
    if (result) {
      wiki(result[1], to);
    }
  });

  function wiki(article, to) {
    var request = require('request');
    var url = "https://en.wikipedia.org/w/api.php?format=json&action=opensearch&namespace=0&search=" + encodeURIComponent(article) + "&limit=1";

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var wiki = JSON.parse(body);
        if (wiki[1] != '') { // there's a match for our search term
          var url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exsentences=1&exintro=&explaintext=&exsectionformat=plain&titles=" + wiki[1] + "&redirects=";
          request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var wiki = JSON.parse(body).query.pages;
              wiki = wiki[Object.keys(wiki)[0]];
              if (!wiki.hasOwnProperty('missing')) {
                var title = wiki.title;
                var url = ' - ' + encodeURI("https://en.wikipedia.org/wiki/" + title);
                var extract = wiki.extract.replace(/\n/g, ", "); // wiki results gives us newlines now and then
                if (url.length + extract.length > 420) {
                  // IRC message length limit is 512, take nick/host into account (arbitrarily atm) and shorten extract to fit together with URL
                  extract = extract.substr(0,417-url.length) + '...';
                }
                bot.say(to, extract + url);
              }
            }
          });
        } else { // no search result
          bot.say(to, 'No result for "' + article + '".');
        }
      }
    });
  };
};

module.exports = init;
