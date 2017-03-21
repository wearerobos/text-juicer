/*


*/

var moment = require('moment');
var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;

var PATTERN = /(\W|^)\s*\b(?:pela)?\s*(manh[ãa]|tarde|noite)\b\s*/i;

var TIME_MATCH = 2;

exports.Parser = function PTBRCasualTimeParser(){

    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var text = match[0].substr(match[1].length);
        var index = match.index + match[1].length;
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        if(!match[TIME_MATCH]) TIME_MATCH = 3;

        if (match[TIME_MATCH] == "tarde") {

            result.start.imply('hour', opt['evening'] ? opt['evening'] : 15);

        } else if (match[TIME_MATCH] == "noite") {

            result.start.imply('hour', opt['night'] ? opt['night'] : 21);

        } else if (/manh[aã]/.test(match[TIME_MATCH])) {

            result.start.imply('hour', opt['morning'] ? opt['morning'] : 9);

        }

        result.tags['PTBRCasualTimeParser'] = true;
        return result;
    };
};
