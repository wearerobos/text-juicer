const _        = require('lodash'),
      chronoBR = require('../../../libs/chrono-node-br/chronoBR');

module.exports = (text) => {
  const parsedText = _.deburr(text);
  const parsedDates = chronoBR.parse(parsedText);
  const result = _.map(parsedDates, date => ({
    base: date.ref,
    start: date.index,
    end: date.index + date.text.length,
    match: date.text,
    type: date.end ? 'range' : 'plain',
    data: date.end ?
      { start: date.start.date(), end: date.end.date() } :
      date.start.date()
  }));

  if (result.length) return result;

};
