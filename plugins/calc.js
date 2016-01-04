/* Calculator evalution */

'use strict';

module.exports = {
  "message": {
    "regex": /^!(?:calc|c)\s+(.+)/i,
    "handler": function (params) {
      var math = require('mathjs');
      var from = params.from;
      var result = params.result;
      var callback = params.callback;

      try {
        var calculationResult = math.format(math.eval(result[1]), { precision: 14 });
        callback(from + ', ' + calculationResult);
      } catch (err) {
        callback(from + ', Error: Dunno.');
      }
    }
  }
}
