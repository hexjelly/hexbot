/* Get current world record for Elasto Mania internal levels */

'use strict';

function init (bot) {
  var regex = /^!wr\s*0*(\d*)$/i; // matches lines starting with '!wr' followed by optional whitespace, optional 0s, then digit(s)

  bot.on('message', function(from, to, text) {
    var result = regex.exec(text);
    if (result && result[1] <= 54 && result[1] >= 1) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      getWR(result[1], function (result) {
        bot.say(to, result);
      });
    }
  });

  function getWR(n, callback) {
    var request = require('request');
    var cheerio = require('cheerio');
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

    var result = n + '. ' + internals[parseInt(n)-1] + ': ';
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var elementNumber = (n < 28 ? (n * 6) + 2 : ((n-27) * 6) + 5);
        var $ = cheerio.load(body);
        var wrTime = $('td', '.wrtable').eq(elementNumber-1).text();
        var wrHolder = $('td', '.wrtable').eq(elementNumber).text();
        result += wrTime + ' by ' + wrHolder;
        callback(result);
      }
    });
  };
};

module.exports = init;
