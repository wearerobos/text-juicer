/*


*/

var moment = require('moment');
var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;
var util  = require('../../utils/PT-BR');

var PATTERN = new RegExp('' +
    '(\\W|^)' +
    '(?:em)?\\s*(?:u[n,m]a?s\\s*)?' +
    '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|u[n,m]a?s?|pouc[ao]s?|algu(?:mas?|ns?)|mei[ao])?\\s*' +
    '(seg(?:undo)?s?|min(?:uto)?s?|h(?:ora)s?|dias?|semanas?|m[eê]s(?:es)?|anos?)\\b\\s*' +
    '(?:atr[áa][sz]|mais\\s*[sc]edo|antes|passad[oa])(?=(?:\\W|$))', 'i');

var STRICT_PATTERN = new RegExp('' +
    '(\\W|^)' +
    '(?:em\\s*)?' +
    '([0-9]+|uma?)\\s*' +
    '(segundos?|minutos?|horas?|dias?)\\s*' +
    'atr[aá][sz](?=(?:\\W|$))', 'i');

exports.Parser = function PTBRTimeAgoFormatParser(){
    Parser.apply(this, arguments);

    this.pattern = function() {
        return this.isStrictMode()? STRICT_PATTERN : PATTERN;
    };

    this.extract = function(text, ref, match, opt){

        if (match.index > 0 && text[match.index-1].match(/\w/)) return null;

        var text = match[0];
        text  = match[0].substr(match[1].length, match[0].length - match[1].length);
        index = match.index + match[1].length;

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref
        });

        var num = match[2] ? match[2].toLowerCase() : '1';
        if (util.INTEGER_WORDS[num] !== undefined) {
            num = util.INTEGER_WORDS[num];
        } else if(num.match(/u[n,m]a/)){
          if (num.match(/s$/)) {
            num = 3;
          } else {
            num = 1;
          }
        } else if (num.match(/pouc[ao]s?|algu(?:mas?|ns?)/)) {
            num = 3;
        } else if (num.match(/mei[ao]/)) {
            num = 0.5;
        } else {
            num = parseInt(num);
        }

        var date = moment(ref);

        if (match[3].match(/h|min|seg/i)) {
            if (match[3].match(/h/i)) {

                date.add(-num, 'hour');

            } else if (match[3].match(/min/i)) {

                date.add(-num, 'minute');

            } else if (match[3].match(/seg/i)) {

                date.add(-num, 'second');
            }

            result.start.imply('day', date.date());
            result.start.imply('month', date.month() + 1);
            result.start.imply('year', date.year());
            result.start.assign('hour', date.hour());
            result.start.assign('minute', date.minute());
            result.start.assign('second', date.second());
            result.tags['PTBRTimeAgoFormatParser'] = true;
            return result;
        }

        if (match[3].match(/semana/i)) {
            date.add(-num, 'week');

            result.start.imply('day', date.date());
            result.start.imply('month', date.month() + 1);
            result.start.imply('year', date.year());
            result.start.imply('weekday', date.day());
            return result;
        }

        if (match[3].match(/dia/i)) {
            date.add(-num, 'd');
        }

        if (match[3].match(/m[êe]s/i)) {
            date.add(-num, 'month');
        }

        if (match[3].match(/ano/i)) {

            date.add(-num, 'year');
        }

        result.start.assign('day', date.date());
        result.start.assign('month', date.month() + 1);
        result.start.assign('year', date.year());
        return result;

    };
}
