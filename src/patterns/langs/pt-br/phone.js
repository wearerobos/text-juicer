const _ = require('lodash');

module.exports = (text) => {
  const pattern = /\b(\+?\d{1,2})?\s*[\(\[\/\\-]*?\s*(\d{2,3})?\s*[\)\]\/\\]*?[\s-]*?(\d{4,5})[-\s\/\/]*?(\d{4,5})\b/g;

  const extracted = [];

  while (match = pattern.exec(text)) {
    extracted.push(match);
  }

  const result = _.map(extracted, ex => {
    const countryCode = ex[1];
    let ddd = ex[2];
    let tel_1 = ex[3];
    const tel_2 = ex[4];

    if (ddd && ddd.length === 3) {
      ddd = ex[2].substr(1);
      if (Number.parseInt(ex[2][0]) !== 0) {
        ddd = ex[2].substr(0,2);
        tel_1 = ex[2].substr(2) + ex[3];
      }
    }

    return {
      start: ex.index,
      end: ex.index + ex[0].length,
      match: ex[0],
      data: {
        countryCode: countryCode || '+55',
        ddd,
        phone: _.compact([tel_1,  tel_2]).join('-')
      }
    }
  });

  if (result.length) return result;

}
