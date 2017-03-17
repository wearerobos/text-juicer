const _          = require('lodash'),
      localUtils = require('./utils');

module.exports = (text) => {
  const pattern = /\b((?:[\. \-\/\\]*?(?:\d)){14})\b/g;

  let extracted = [];

  while (match = pattern.exec(text)) {
    extracted.push(match);
  }

  const result = _.map(extracted, ex => {
    const cnpjText = ex ? ex[0] : 0;

    if (localUtils.validateCNPJ(cnpjText)) {
      const cnpjNum = cnpjText.replace(/[^\d]+/g,'');
      cnpjFormat = cnpjNum.split('');
      cnpjFormat.splice(12, 0, '-');
      cnpjFormat.splice(8, 0, '/');
      cnpjFormat.splice(5, 0, '.');
      cnpjFormat.splice(2, 0, '.');
      const data = cnpjFormat.join('');

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
