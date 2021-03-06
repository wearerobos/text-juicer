const _ = require('lodash');

module.exports = (text) => {
  const pattern = /\b\+?(\d[\(\[\/\\\-\s\)\]]*){8,15}\b/g;

  const extracted = [];

  while (match = pattern.exec(text)) {
    extracted.push(match);
  }

  const result = _(extracted).map(ex => {

    let tel_1, tel_2, areaCode, countryCode;

    let phone = ex[0].replace(/\D/g, '');

    if (phone.length == 8) {
      tel_2 = phone.substr(-4);
      tel_1 = phone.substr(-8, 4);
    } else if (phone.length == 9) {
      tel_2 = phone.substr(-4);
      tel_1 = phone.substr(-9, 5);
    } else if (phone.length == 10) {
      tel_2 = phone.substr(-4);
      tel_1 = phone.substr(-8, 4);
      areaCode = phone.substr(-10, 2);
    } else if (phone.length == 11) {
      tel_2 = phone.substr(-4);
      tel_1 = phone.substr(-9, 5);
      areaCode = phone.substr(-11, 2);
    } else if (phone.length == 12) {
      tel_2 = phone.substr(-4);
      tel_1 = phone.substr(-8, 4);
      areaCode = phone.substr(-10, 2);
      countryCode = '+' + phone.substr(-12, 2);
    } else if (phone.length == 13) {
      tel_2 = phone.substr(-4);
      tel_1 = phone.substr(-9, 5);
      areaCode = phone.substr(-11, 2);
      countryCode = '+' + phone.substr(-13, 2);
    }

    return {
      start: ex.index,
      end: ex.index + ex[0].length,
      match: ex[0],
      data: {
        countryCode: countryCode || '+55',
        areaCode,
        phone: _.compact([tel_1,  tel_2]).join('-')
      }
    }
  })
  .compact()
  .value();

  if (result.length) return result;

}
