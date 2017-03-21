/*


*/

var moment = require('moment');
var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;
var util  = require('../../utils/PT-BR');

var PATTERN = new RegExp('(\\W|^)' +
    '(em|dentro\\s*de)\\s*(?:u[n,m]a?s\\s*)?' +
    '('+ util.INTEGER_WORDS_PATTERN + '|[0-9]+|pouc[ao]s?|algu(?:mas?|ns?)|mei[ao])?\\s*' +
    '(seg(?:undo)?s?|min(?:uto)?s?|h(?:ora)?s?|dias?|semanas?|m[eê]s(?:es)?|anos?)\\b\\s*' +
    '(?=\\W|$)', 'i'
);

var STRICT_PATTERN = new RegExp('(\\W|^)' +
    '(em|dentro\\s*de)\\s*' +
    '('+ util.INTEGER_WORDS_PATTERN + '|[0-9]+)\\s*' +
    '(segundos?|minutos?|horas?|dias?)\\s*' +
    '(?=\\W|$)', 'i'
);

exports.Parser = function PTBRDeadlineFormatParser(){
    Parser.apply(this, arguments);

    this.pattern = function() {
        return this.isStrictMode()? STRICT_PATTERN : PATTERN;
    };

    this.extract = function(text, ref, match, opt){

        var index = match.index + match[1].length;
        var text  = match[0];
        text  = match[0].substr(match[1].length, match[0].length - match[1].length);

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref
        });

        var num = match[3] ? match[3].toLowerCase() : '0';
        if (util.INTEGER_WORDS[num] !== undefined) {
            num = util.INTEGER_WORDS[num];
        } else if (num.match(/algu(?:mas?|ns?)|pouc[ao]s?/i)){
            num = 3;
        } else if (num.match(/mei[oa]/i)) {
            num = 0.5;
        } else {
            num = parseInt(num);
        }

        var date = moment(ref);
        if (match[4].match(/dia|semana|m[eê]s|ano/i)) {

            if (match[4].match(/dia/i)) {
                date.add(num, 'd');
            } else if (match[4].match(/semana/i)) {
                date.add(num * 7, 'd');
            } else if (match[4].match(/m[eê]s/i)) {
                date.add(num, 'month');
            } else if (match[4].match(/ano/i)) {
                date.add(num, 'year');
            }

            result.start.assign('year', date.year());
            result.start.assign('month', date.month() + 1);
            result.start.assign('day', date.date());
            return result;
        }

        if (match[4].match(/h/i)) {

            date.add(num, 'hour');

        } else if (match[4].match(/min/i)) {

            date.add(num, 'minute');

        } else if (match[4].match(/seg/i)) {

            date.add(num, 'second');
        }

        result.start.imply('year', date.year());
        result.start.imply('month', date.month() + 1);
        result.start.imply('day', date.date());
        result.start.assign('hour', date.hour());
        result.start.assign('minute', date.minute());
        result.start.assign('second', date.second());
        result.tags['PTBRDeadlineFormatParser'] = true;
        return result;
    };
};
