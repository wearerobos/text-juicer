const _ = require('lodash');

module.exports = (text) => {
  const pattern = /\b\+?(\d[\(\[\/\\\-\s\)\]]*){7,13}\b/g;

  const extracted = [];

  while (match = pattern.exec(text)) {
    extracted.push(match);
  }

  const result = _(extracted).map(ex => {

    let tel_1, tel_2, areaCode, countryCode;

    let phone = ex[0].replace(/\D/g, '');

    if (phone.length < 7 || phone.length > 8 && phone.length < 10) return;

    tel_2 = phone.substr(-4);
    tel_1 = phone.substr(-7, 3);

    if (phone.length >= 10) {
      areaCode = phone.substr(-10, 3);
      if (phone.length == 11) countryCode = '+' + phone.substr(-11, 1);
      if (phone.length == 12) countryCode = '+' + phone.substr(-12, 2);
      if (phone.length == 13) countryCode = '+' + phone.substr(-13, 3);
    }

    return {
      start: ex.index,
      end: ex.index + ex[0].length,
      match: ex[0],
      data: {
        countryCode: countryCode || '+1',
        areaCode,
        phone: _.compact([tel_1,  tel_2]).join('-')
      }
    }
  })
  .compact()
  .value();

  if (result.length) return result;

}
