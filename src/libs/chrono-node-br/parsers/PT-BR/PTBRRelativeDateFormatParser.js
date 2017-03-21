/*


*/

var moment = require('moment');
var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;
var util  = require('../../utils/PT-BR');

var PATTERN = new RegExp('(\\W|^)' +
    '\\b(daqui|mais|pr[óo]xim[ao]s?|[úu]ltim[oa]s?|tem|faz(?:em)?)?\\s*(?:u[n,m]a?s\\s*)?' +
    '('+ util.INTEGER_WORDS_PATTERN + '|[0-9]+|mei[oa])?\\s*' +
    '(seg(?:undo)?s?|min(?:uto)?s?|h(?:ora)?s?|dias?|semanas?|m[êe]s(?:es)?|anos?)\\b\\s*' +
    '(que\\s*vem)?' +
    '(?=\\W|$)', 'i'
);

var MODIFIER_WORD_GROUP = 2;
var MULTIPLIER_WORD_GROUP = 3;
var RELATIVE_WORD_GROUP = 4;
var POST_WORD_GROUP = 5;

exports.Parser = function PTBRRelativeDateFormatParser(){
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; };

    this.extract = function(text, ref, match, opt){
        var index = match.index + match[1].length;
        var modifier = match[MODIFIER_WORD_GROUP] && match[MODIFIER_WORD_GROUP].toLowerCase().match(/ltim|^tem|^faz/) ? -1 : 1;
        var text  = match[0];
        text  = match[0].substr(match[1].length, match[0].length - match[1].length);
        if (!match[POST_WORD_GROUP] && !match[MODIFIER_WORD_GROUP]) return;

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref
        });
        result.tags['PTBRRelativeDateFormatParser'] = true;

        var num = match[MULTIPLIER_WORD_GROUP] === undefined ? '' : match[3].toLowerCase();
        if (util.INTEGER_WORDS[num] !== undefined) {
            num = util.INTEGER_WORDS[num];
        } else if (num === ''){
          if (match[MODIFIER_WORD_GROUP] && match[MODIFIER_WORD_GROUP].match(/s$/)) {
            num = 3;
          } else {
            num = 1;
          }
        } else if (num.match(/mei[oa]/i)) {
            num = 0.5;
        } else {
            num = parseInt(num);
        }

        num *= modifier;

        if (match[POST_WORD_GROUP] && match[POST_WORD_GROUP].match(/que\s*vem/)) {
          num = 1;
        }

        var date = moment(ref);
        if (match[RELATIVE_WORD_GROUP].match(/dia|semana|m[eê]s|ano/i)) {

            if (match[RELATIVE_WORD_GROUP].match(/dia/i)) {
                date.add(num, 'd');
                result.start.assign('year', date.year());
                result.start.assign('month', date.month() + 1);
                result.start.assign('day', date.date());
            } else if (match[RELATIVE_WORD_GROUP].match(/semana/i)) {
                date.add(num * 7, 'd');
                // We don't know the exact date for next/last week so we imply
                // them
                result.start.imply('day', date.date());
                result.start.imply('month', date.month() + 1);
                result.start.imply('year', date.year());
            } else if (match[RELATIVE_WORD_GROUP].match(/m[eê]s/i)) {
                date.add(num, 'month');
                // We don't know the exact day for next/last month
                result.start.imply('day', date.date());
                result.start.assign('year', date.year());
                result.start.assign('month', date.month() + 1);
            } else if (match[RELATIVE_WORD_GROUP].match(/ano/i)) {
                date.add(num, 'year');
                // We don't know the exact day for month on next/last year
                result.start.imply('day', date.date());
                result.start.imply('month', date.month() + 1);
                result.start.assign('year', date.year());
            }

            return result;
        }

        if (match[RELATIVE_WORD_GROUP].match(/h/i)) {

            date.add(num, 'hour');
            result.start.imply('minute', date.minute());
            result.start.imply('second', date.second());

        } else if (match[RELATIVE_WORD_GROUP].match(/min/i)) {

            date.add(num, 'minute');
            result.start.assign('minute', date.minute());
            result.start.imply('second', date.second());

        } else if (match[RELATIVE_WORD_GROUP].match(/seg/i)) {

            date.add(num, 'second');
            result.start.assign('second', date.second());
            result.start.assign('minute', date.minute());
        }

        result.start.assign('hour', date.hour());
        result.start.assign('year', date.year());
        result.start.assign('month', date.month() + 1);
        result.start.assign('day', date.date());
        return result;
    };
};
