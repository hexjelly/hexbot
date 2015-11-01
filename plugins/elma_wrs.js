/* Get current world record for Elasto Mania internal levels */

'use strict';

module.exports = (function () {
  return function init(bot) {
    var regex = /^!wr\s*0*(\d+)$/i; // matches lines starting with '!wr' followed by optional whitespace, optional 0s, then digit(s)

    bot.on('message', function(from, to, text) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      var result = re.exec(text);
      if (result && result[1] <= 54) {
        bot.say(to,getWR(result[1]));
      }
    });
  };
  function getWR(n) {
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
    return n + '. ' + internals[n+1] + ': ';
  };
})();
