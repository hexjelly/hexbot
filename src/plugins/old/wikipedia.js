/* jshint node: true */
/* Get Wikipedia information */

'use strict';

var request = require('request');
var util = require('util');

module.exports = {
  "message": {
    "regex": /^!wiki?\s+(.+)/i,
    "handler": function (params) {
      var article = params.result[1];
      var to = params.to;
      var callback = params.callback;
      var url = "https://en.wikipedia.org/w/api.php?format=json&action=opensearch&namespace=0&search=" + encodeURIComponent(article) + "&limit=1";

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var wiki = JSON.parse(body);
          if (wiki[1].length > 0) { // there's a match for our search term
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
                  callback.say(to, extract + url);
                }
              }
            });
          } else { // no search result
            callback.say(to, 'No result for "' + article + '".');
          }
        } else if (error) {
          util.log(error);
        }
      });
    }
  }
};
