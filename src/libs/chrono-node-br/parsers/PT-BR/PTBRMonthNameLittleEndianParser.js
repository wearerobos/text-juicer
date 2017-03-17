/*


*/

var moment = require('moment');

var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;
var util  = require('../../utils/PT-BR');

var PATTERN = new RegExp('(\\W|^)' +
        '(?:n[oa]\\s*?)?' +
        '\\b(?:(' + util.WEEKDAY_OFFSET_PATTERN + ')(?:-feira)?\\b\\s*,?\\s*)?' +
        '(([0-9]{1,2})|' + util.INTEGER_WORDS_PATTERN + ')' +
        '(?:\\s*' +
            '(?:at[ée]|\\-|\\–|\\s)\\s*' +
            '(([0-9])?|' + util.INTEGER_WORDS_PATTERN + ')' +
        ')?\\s*(?:de)?\\s*(' + util.MONTH_OFFSET_PATTERN + ')' +
        '(?:' +
            ',?(?:\\s*de)?\\s*([0-9]{1,4}(?![^\\s]\\d))' +
            '(\\s*(?:A\.?C\.?|D\.?C\.?))?' +
        ')?' +
        '(?=\\W|$)', 'i'
    );

var WEEKDAY_GROUP = 2;
var DATE_GROUP = 3;
var DATE_NUM_GROUP = 4;
var DATE_TO_GROUP = 5;
var DATE_TO_NUM_GROUP = 6;
var MONTH_NAME_GROUP = 7;
var YEAR_GROUP = 8;
var YEAR_BE_GROUP = 9;

exports.Parser = function PTBRMonthNameLittleEndianParser(){
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var result = new ParsedResult({
            text: match[0].substr(match[1].length, match[0].length - match[1].length),
            index: match.index + match[1].length,
            ref: ref
        });

        var month = match[MONTH_NAME_GROUP];
        month = util.MONTH_OFFSET[month.toLowerCase()];

        var day = match[DATE_NUM_GROUP] || util.INTEGER_WORDS[match[DATE_GROUP]];

        var year = null;
        if (match[YEAR_GROUP]) {
            year = match[YEAR_GROUP];
            year = parseInt(year);

            if(match[YEAR_BE_GROUP]){

                if (/A\.?C\.?/i.test(match[YEAR_BE_GROUP])) {
                    // Before Christ
                    year = -year;
                }

            } else if (year < 10) {

                // require single digit years to always have BC/AD
                return null;

            } else if (year < 100){

                year = year + 2000;
            }
        }

        if(year){
            result.start.assign('day', day);
            result.start.assign('month', month);
            result.start.assign('year', year);
        } else {

            //Find the most appropriated year
            var refMoment = moment(ref);
            refMoment.month(month - 1);
            refMoment.date(day);
            refMoment.year(moment(ref).year());

            var nextYear = refMoment.clone().add(1, 'y');
            var lastYear = refMoment.clone().add(-1, 'y');
            if( Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref))) ){
                refMoment = nextYear;
            }
            else if( Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref))) ){
                refMoment = lastYear;
            }

            result.start.assign('day', day);
            result.start.assign('month', month);
            result.start.imply('year', refMoment.year());
        }

        // Weekday component
        if (match[WEEKDAY_GROUP]) {
            var weekday = match[WEEKDAY_GROUP];
            weekday = util.WEEKDAY_OFFSET[weekday.toLowerCase()]
            result.start.assign('weekday', weekday);
        }

        // Text can be 'range' value. Such as '12 - 13 January 2012'
        if (match[DATE_TO_GROUP]) {
            var endDate = parseInt(match[DATE_TO_NUM_GROUP]);

            result.end = result.start.clone();
            result.end.assign('day', endDate);
        }

        result.tags['PTBRMonthNameLittleEndianParser'] = true;
        return result;
    };
};
