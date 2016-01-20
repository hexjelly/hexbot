/* jshint node: true */
/* Calculator evalution */

'use strict';

var math = require('mathjs');

module.exports = {
  "message": {
    "regex": /^!(?:calc|c)\s+(.+)/i,
    "handler": function (params) {
      var from = params.from;
      var to = params.to;
      var result = params.result;
      var callback = params.callback;

      try {
        var calculationResult = math.format(math.eval(result[1]), { precision: 14 });
        callback.say(to, from + ', ' + calculationResult);
      } catch (err) {
        callback.say(to, from + ', User error: ' + err);
      }
    }
  }
};
