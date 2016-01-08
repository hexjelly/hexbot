/* Get title of pages linked in channel */

'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  "message": {
    "regex": /((?:https?\:\/\/)|(?:www\.))(\S+\.\S+)/i,
    "handler": function (params) {
      var result = params.result;
      var callback = params.callback;
      var url = (result[1] != 'www.' ? result[1] + result[2] : 'http://' + result[2]);
      var ignoreRegex = /^(?:.+\.)?([^\/\?]+\.[^\/\?]+)(?:\/|\?)?.*?$/i;
      // because i'm too dumb to figure out some non-manual way to do this ._. ignore sites either handled by other plugins, or has poor titles
      // move this to config file later!
      var ignore = ['youtube.com', 'youtu.be', 'wikipedia.org', 'imdb.com', 'facebook.com', 'recsource.tv'];
      var host = ignoreRegex.exec(result[2]);

      if (ignore.indexOf(host[1].toLowerCase()) === -1) {
        request({ url: url, method: "HEAD" }, function (err, headRes) {

          /* var maxSize = 10485760; might be wise to limit a request attempt's size even if checking for content-type
          var size = headRes.headers['content-length'];
          if (size > maxSize) {
              // too big
          } else {
            size = 0;
            var res = request({ url: url }, function (err, response, body) {
              // do stuff here
            }).on('data', function (data) { // let's not trust content-length
                size += data.length;
                if (size > maxSize) {
                    res.abort();
                }
            }).pipe(file);
          } */

          // only check for title of html files; indexOf because some sites send additional information in content-type header
          if (headRes && headRes.headers['content-type'].indexOf('text/html') > -1) {
            request(url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var title = $('title').text().replace(/(?:\r\n|\r|\n|\s{2,})/g, ''); // remove newlines and multiple space characters
                if (title) callback('[Title] ' + title);
              }
            });
          } else {
            // console.log(headRes.headers['content-type']);
          }
        });
      }
    }
  }
}
