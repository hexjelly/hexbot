/* jshint node: true */
/* Get current world record for Elasto Mania internal levels */

'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  "message": {
    "regex": /^!wr\s*0*(\d*)$/i,
    "handler": function (params) {
      var wr = params.result[1];
      var to = params.to;
      var callback = params.callback;
      var url = 'http://www.moposite.com/records_elma_wrs.php';
      // no point parsing names of levels from the page as they won't change and we already know them
      var internals = ['Warm Up','Flat Track','Twin Peaks','Over and Under','Uphill Battle','Long Haul',
                      'Hi Flyer','Tag','Tunnel Terror','The Steppes','Gravity Ride','Islands in the Sky',
                      'Hill Legend','Loop-de-Loop','Serpents Tale','New Wave','Labyrinth','Spiral',
                      'Turnaround','Upside Down','Hangman','Slalom','Quick Round','Ramp Frenzy','Precarious',
                      'Circuitous','Shelf Life','Bounce Back','Headbanger', 'Pipe','Animal Farm','Steep Corner',
                      'Zig-Zag','Bumpy Journey','Labyrinth Pro','Fruit in the Den','Jaws','Curvaceous',
                      'Haircut','Double Trouble','Framework','Enduro','He He','Freefall','Sink','Bowling',
                      'Enigma','Downhill','What the Heck','Expert System','Tricks Abound','Hang Tight',
                      'Hooked','Apple Harvest'];
      if (wr <= 54 && wr >= 1) {
        var result = wr + '. ' + internals[parseInt(wr)-1] + ': ';
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var elementNumber = (wr < 28 ? (wr * 6) + 2 : ((wr-27) * 6) + 5);
            var $ = cheerio.load(body);
            var wrTime = $('td', '.wrtable').eq(elementNumber-1).text();
            var wrHolder = $('td', '.wrtable').eq(elementNumber).text();
            result += wrTime + ' by ' + wrHolder;
            callback.say(to, result);
          }
        });
      }
    }
  }
};
