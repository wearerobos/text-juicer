const _          = require('lodash'),
      localUtils = require('./utils');

module.exports = (text) => {
  const pattern = /\b((?:[\. \-\/\\]*?(?:\d)){11})\b/g;

  let extracted = [];

  while (match = pattern.exec(text)) {
    extracted.push(match);
  }

  const result = _.map(extracted, ex => {
    const cpfText = ex ? ex[0] : 0;

    if (localUtils.validateCPF(cpfText)) {
      const cpfNum = cpfText.replace(/[^\d]+/g,'');
      cpfFormat = cpfNum.split('');
      cpfFormat.splice(9, 0, '-');
      cpfFormat.splice(6, 0, '.');
      cpfFormat.splice(3, 0, '.');
      data = cpfFormat.join('');

      return {
        start: ex.index,
        end: ex.index + ex[0].length,
        match: ex[0],
        data
      }
    }
  });

  if (result.length) return result;
}
