/*
lastnight -> (noite\s*passada|ontem\s*[aà]\s*noite)

*/

var moment = require('moment');
var Parser = require('chrono-node').Parser;
var ParsedResult = require('chrono-node').ParsedResult;

var PATTERN = /(\W|^)\b(agora|hoje|noite\s*passada|(?:depois\s*de\s*)?amanh[ãa]|ontem|ant[ei]\s*ontem)\b(?=\W|$)/i;

exports.Parser = function PTBRCasualDateParser(){

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

        var refMoment = moment(ref);
        var startMoment = refMoment.clone();
        var lowerText = text.toLowerCase();

        if (/depois\s*de\s*amanh[ãa]/.test(lowerText)) {
            // Check not "Tomorrow" on late night
            if(refMoment.hour() > 1) {
                startMoment.add(2, 'day');
            } else {
                startMoment.add(1, 'day');
            }


        } else if (/amanh[ãa]/.test(lowerText)) {

            // Check not "Tomorrow" on late night
            if(refMoment.hour() > 1) {
                startMoment.add(1, 'day');
            }

        } else if (/^ontem/.test(lowerText)) {

            startMoment.add(-1, 'day');

        } else if (/^ant[ei]ontem/.test(lowerText)) {

            startMoment.add(-2, 'day');

        } else if(lowerText == "noite passada") {

            result.start.imply('hour', 0);
            if (refMoment.hour() > 6) {
                startMoment.add(-1, 'day');
            }

        } else if (lowerText.match("agora")) {

          result.start.imply('hour', refMoment.hour());
          result.start.imply('minute', refMoment.minute());
          result.start.imply('second', refMoment.second());
          result.start.imply('millisecond', refMoment.millisecond());

        }

        result.start.assign('day', startMoment.date())
        result.start.assign('month', startMoment.month() + 1)
        result.start.assign('year', startMoment.year())
        result.tags['PTBRCasualDateParser'] = true;
        return result;
    }
}
