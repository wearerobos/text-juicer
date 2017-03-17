const chrono = require('chrono-node');
const _      = require('lodash');

const PTBRCasualDateParser = require('./parsers/PT-BR/PTBRCasualDateParser').Parser;
const PTBRCasualTimeParser = require('./parsers/PT-BR/PTBRCasualTimeParser').Parser;
const PTBRWeekdayParser = require('./parsers/PT-BR/PTBRWeekdayParser').Parser;
const PTBRDeadlineFormatParser = require('./parsers/PT-BR/PTBRDeadlineFormatParser').Parser;
const PTBRMonthNameLittleEndianParser = require('./parsers/PT-BR/PTBRMonthNameLittleEndianParser').Parser;
const PTBRMonthNameParser = require('./parsers/PT-BR/PTBRMonthNameParser').Parser;
const PTBRRelativeDateFormatParser = require('./parsers/PT-BR/PTBRRelativeDateFormatParser').Parser;
const PTBRSlashDateFormatParser = require('./parsers/PT-BR/PTBRSlashDateFormatParser').Parser;
const PTBRTimeAgoFormatParser = require('./parsers/PT-BR/PTBRTimeAgoFormatParser').Parser;
const PTBRTimeExpressionParser = require('./parsers/PT-BR/PTBRTimeExpressionParser').Parser;
const PTBRSlashMonthFormatParser = require('./parsers/PT-BR/PTBRSlashMonthFormatParser').Parser;

const PTBRMergeDateTimeRefiner = require('./refiners/PT-BR/PTBRMergeDateTimeRefiner').Refiner;
const PTBRMergeDateRangeRefiner = require('./refiners/PT-BR/PTBRMergeDateRangeRefiner').Refiner;

const BRcasual = function() {
  const option = {
    parsers: [
      new PTBRRelativeDateFormatParser(),
      new PTBRWeekdayParser(),
      new PTBRCasualTimeParser(),
      new PTBRCasualDateParser(),
      new PTBRDeadlineFormatParser(false),
      new PTBRMonthNameLittleEndianParser(false),
      new PTBRMonthNameParser(false),
      new PTBRSlashDateFormatParser(false),
      new PTBRTimeAgoFormatParser(false),
      new PTBRTimeExpressionParser(false),
      new PTBRSlashMonthFormatParser(false),
    ],
    refiners: [
      new chrono.refiner.OverlapRemovalRefiner(),
      new chrono.refiner.ForwardDateRefiner(),
      new PTBRMergeDateTimeRefiner(),
      new PTBRMergeDateRangeRefiner(),
    ]
  }

  return option;
}

module.exports = new chrono.Chrono(chrono.options.mergeOptions([
    BRcasual, chrono.options.en, chrono.options.commonPostProcessing]));
