const _ = require('lodash');

module.exports = (text) => {
  const pattern = /\b(\d{5})[\.\-\/\\ ]*?(\d{3})\b/g;

  let extracted = [];

  while (match = pattern.exec(text)) {
    extracted.push(match);
  }

  const result = _.map(extracted, ex => {
    let cnpjText = ex ? ex[0] : 0;

    return {
      start: ex.index,
      end: ex.index + ex[0].length,
      match: ex[0],
      data: `${ex[1]}-${ex[2]}`
    }
  });

  if (result.length) return result;

}
