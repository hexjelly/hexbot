/* jshint node: true */
/* Get Last.fm recently played track */

'use strict';

var nconf = require('nconf');
var request = require('request');

module.exports = {
  "message": {
    "regex": /^!(?:lastfm|lfm)(?:\s+(.+))?$/i,
    "handler": function (params) {
      var APIKey = nconf.get('plugins').lastfm.APIKey;
      var user = (params.result[1] ? params.result[1] : params.from);
      var callback = params.callback;

      var url = "http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=" + encodeURIComponent(user) + "&nowplaying=true&limit=1&extended=0&format=json&api_key=" + APIKey;

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var lastfm = JSON.parse(body);
          if (lastfm.error) {
            callback('Error: ' + lastfm.message);
          } else {
            if (lastfm.recenttracks.track.length > 0) {
              var np = lastfm.recenttracks.track[0].artist['#text'] + ' - ' + lastfm.recenttracks.track[0].name;
              callback(lastfm.recenttracks['@attr'].user + (lastfm.recenttracks.track[0]['@attr'] ? ' np: ' : ' lp: ') + np);
            }
          }
        }
      });
    }
  }
};
