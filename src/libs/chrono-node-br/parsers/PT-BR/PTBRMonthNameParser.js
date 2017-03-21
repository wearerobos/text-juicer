/*

    The parser for parsing month name and year.

    EX.
        - Janeiro
        - Janeiro 2012
        - Janeiro, 2012
        - Janeiro de 2012
*/

var moment = require('moment');

var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;
var util  = require('../../utils/PT-BR');

// There is no OPTIONAL abbreviation for "Dezembro" (December) to not be confused with the numeral "dez" (10)
var PATTERN = new RegExp('(^|\\D\\s+|[^\\w\\s])' +
    '\\b(Jan(?:eiro|\\.)?|Fev(?:reiro|\\.)?|Mar(?:[çc]o|\\.)?|Abr(?:il|\\.)?|Mai(?:o|\\.)?|Jun(?:ho|\\.)?|Jul(?:ho|\\.)?|Ago(?:sto|\\.)?|Set(?:embro|\\.)?|Out(?:ubro|\\.)?|Nov(?:embro|\\.)?|Dez(?:embro|\\.))\\b' +
    '\\s*' +
    '(?:' +
        '[,-]?(?:de)?\\s*([0-9]{3,4})(\\s*A\\.?C\\.?)?' +
    ')?' +
    '(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)', 'i');

var MONTH_NAME_GROUP = 2;
var YEAR_GROUP = 3;
var YEAR_BE_GROUP = 4;

exports.Parser = function PTBRMonthNameParser(){
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){
        var result = new ParsedResult({
            text: match[0].substr(match[1].length, match[0].length - match[1].length),
            index: match.index + match[1].length,
            ref: ref,
        });

        var month = match[MONTH_NAME_GROUP];

        if (!month) return;

        month = util.MONTH_OFFSET[month.toLowerCase()];
        var day = 1;

        var year = null;
        if (match[YEAR_GROUP]) {
            year = match[YEAR_GROUP];
            year = parseInt(year);

            if(match[YEAR_BE_GROUP]){
                if (match[YEAR_BE_GROUP].match(/A\.?C\.?/i)) {
                    // Before Christ
                    year = -year;
                }

            } else if (year < 100){

                year = year + 2000;
            }
        }

        if(year){
            result.start.imply('day', day);
            result.start.assign('month', month);
            result.start.assign('year', year);
        } else {

            //Find the most appropriated year
            var refMoment = moment(ref);
            refMoment.month(month - 1);
            refMoment.date(day);

            var nextYear = refMoment.clone().add(1, 'y');
            var lastYear = refMoment.clone().add(-1, 'y');
            if( Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref))) ){
                refMoment = nextYear;
            }
            else if( Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref))) ){
                refMoment = lastYear;
            }

            result.start.imply('day', day);
            result.start.assign('month', month);
            result.start.imply('year', refMoment.year());
        }

        result.tags['PTBRMonthNameParser'] = true;
        return result;
    }
}
