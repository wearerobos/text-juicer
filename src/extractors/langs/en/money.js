const _             = require('lodash'),
      localUtils    = require('./utils'),
      utils         = require('../../utils'),
      numeral       = require('numeral'),
      numeralLocale = require('numeral/locales/pt-br');

module.exports = (text, matches) => {
  // Don't capture "cents" alone (ie, "10 cents cheaper" will be caught by Number)
  const CURRENCY_REAL = ['rea(?:is|l)'];
  const CURRENCY_DOLAR = ['dollars?', 'bucks?'];
  const CURRENCY_EURO = ['euros?'];

  const REAL_SYMBOL = ['R\\$', 'R'];
  const DOLAR_SYMBOL = ['\\b\\$', 'US\\$', 'USD'];
  const EURO_SYMBOL = ['€\\$?'];

  const CURRENCY_PATTERN = _.concat(CURRENCY_REAL, CURRENCY_DOLAR, CURRENCY_EURO).join('|');
  const CURRENCY_SYMBOLS = _.concat(REAL_SYMBOL, DOLAR_SYMBOL, EURO_SYMBOL).join('|');

  // Check for currency signal
  const check = new RegExp(`\\b(?:(${REAL_SYMBOL.join('|')}|${CURRENCY_REAL.join('|')})|(${DOLAR_SYMBOL.join('|')}|${CURRENCY_DOLAR.join('|')})|(${EURO_SYMBOL.join('|')}|${CURRENCY_EURO.join('|')}))(?:\\b|[^a-zA-z])`, 'gi');
  // Search for places where numbers appears (later it will be matched against currency signal position)
  const pattern = new RegExp(`(?:\\b(?:${CURRENCY_SYMBOLS})?\\s*((?:[\\.\\,]?\\d+)+|(?:(?:${localUtils.INTEGER_WORDS_PATTERN})\\s*e*\\s*)+)\\b\\s*\\b(?:de\\s*)?(${CURRENCY_PATTERN})?\\b[\\se]*)(?:((?:[\\.\\,]?\\d+)+|(?:(?:${localUtils.INTEGER_WORDS_PATTERN})\\s*e*\\s*)+)\\s*((?:de\\s*)?[sc]ent(?:avo)?s?))?`, 'gi');

  const croped = utils.cropText(text, matches);

  // Check for currency signal in text
  let checkCurrency = check.exec(croped);
  if (!checkCurrency) return;

  // Save index where currency signal appears, and the what currency it is
  const indexes = [];
  while (checkCurrency) {
    indexes.push({
      currency: checkCurrency[1] ? 'R$' :
                checkCurrency[2] ? 'US$':
                checkCurrency[3] ? '€' : undefined,
      index: checkCurrency.index
    });
    checkCurrency = check.exec(croped);
  }

  const extracted = [];
  while (match = pattern.exec(croped)) {
    extracted.push(match);
  }

  let result = _.map(extracted, ex => {
    const end = ex.index + ex[0].length;
    let validPosition = false;
    let currency;

    // if currency signal isn't contained in matched text, matched text is not currency value
    indexes.forEach((cur) => {
      if (cur.index >= ex.index && cur.index <= end) {
        validPosition = true;
        currency = cur.currency;
      }
    });

    if (validPosition) {
      const int = `${ex[1]} ${ex[2]}`;
      const cents = `${ex[3]} ${ex[4]}`;
      const intArray = int ? int.split(/\s+/) : null;
      const centsArray = cents ? cents.split(/\s+/) : null;

      const realInt = intArray ? utils.parseNumber(intArray, localUtils.INTEGER_WORDS, 'en') : null;
      const realCent = centsArray ? utils.parseNumber(centsArray, localUtils.INTEGER_WORDS, 'en') : null;

      let data = realInt ? realInt[0] : 0;
      data += realCent ? realCent[0] : 0;

      return {
        start: ex.index,
        end,
        match: ex[0],
        currency,
        data
      }
    }
  });
  result = _.compact(result);

  if (result.length) return result;

}
