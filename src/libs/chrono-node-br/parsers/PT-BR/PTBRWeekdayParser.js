/*


*/
var moment = require('moment');
var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;
var utils = require('../../utils/PT-BR');

var DAYS_OFFSET = utils.WEEKDAY_OFFSET;

var PATTERN = new RegExp('(\\W|^)' +
    '(?:(?:\\,|\\(|\\（)\\s*)?' +
    '(?:(nes[st][ea]|pr[óo]xim[oa]|[uú]ltim[oa])\\s*)?' +
    '(' + Object.keys(DAYS_OFFSET).join('|') + ')(:?-feira)?' +
    '(?:\\s*(?:\\,|\\)|\\）))?' +
    '(?:\\s*(da\\s*semana\\s*passad[oa]|passad[oa]|que\\s*vem)\\s*)?' +
    '(?=\\W|$)', 'i');

var PREFIX_GROUP = 2;
var WEEKDAY_GROUP = 3;
var POSTFIX_GROUP = 5;

exports.updateParsedComponent = function updateParsedComponent(result, ref, offset, modifier) {
    var startMoment = moment(ref);
    var startMomentFixed = false;
    var refOffset = startMoment.day();

    if(/[úu]ltim[oa]/.test(modifier) || /passad[oa]/.test(modifier) || /da\s*semana\s*passad[oa]/.test(modifier)) {
        startMoment.day(offset - 7);
        startMomentFixed = true;
    } else if(/pr[óo]xim[oa]|que\s*vem/.test(modifier)) {
        startMoment.day(offset + 7);
        startMomentFixed = true;
    } else if(/es[st][ea]/.test(modifier)) {
        startMoment.day(offset);
    } else {
        if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
            startMoment.day(offset - 7);
        } else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
            startMoment.day(offset + 7);
        } else {
            startMoment.day(offset);
        }
    }

    result.start.assign('weekday', offset);
    if (startMomentFixed) {
        result.start.assign('day', startMoment.date());
        result.start.assign('month', startMoment.month() + 1);
        result.start.assign('year', startMoment.year());
    } else {
        result.start.imply('day', startMoment.date());
        result.start.imply('month', startMoment.month() + 1);
        result.start.imply('year', startMoment.year());
    }

    return result;
};


exports.Parser = function PTBRWeekdayParser() {
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; };

    this.extract = function(text, ref, match, opt){
        var index = match.index + match[1].length;
        var text = match[0].substr(match[1].length, match[0].length - match[1].length);
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref
        });

        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        var offset = DAYS_OFFSET[dayOfWeek];
        if(offset === undefined) {
            return null;
        }


        var prefix = match[PREFIX_GROUP];
        var postfix = match[POSTFIX_GROUP];
        var norm = prefix || postfix;
        norm = norm || '';
        norm = norm.toLowerCase();

        exports.updateParsedComponent(result, ref, offset, norm);
        result.tags['PTBRWeekdayParser'] = true;

        return result;
    }
};
