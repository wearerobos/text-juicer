const utils      = require('./utils'),
      langs      = require('./index');
      _          = require('lodash');

const langUtils  = {
  'pt-br': require('./langs/pt-br/utils'),
  // en: require('./langs/en/utils')
}

module.exports = {

  email: function (text) {
    const pattern = /\b[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})\b/g;

    const extracted = [];

    while (match = pattern.exec(text)) {
      extracted.push(match);
    }

    const result = _.map(extracted, ex => ({
      start: ex.index,
      end: ex.index + ex[0].length,
      match: ex[0],
      data: ex[0]
    }));

    if (result.length) return result;
  },

  latest: {
    // Document: get protocols, number and letters, etc.. (raw numbers bigger than 8 digits are caught here)
    code: function (text, matches) {
      const pattern = new RegExp('(?!\\D+\\b)(?!\\d+\\b)(\\S+\\b)|(\\d{9,})', 'gi');
      const croped = utils.cropText(text, matches);

      const extracted = [];

      while (match = pattern.exec(croped)) {
        extracted.push(match);
      }

      var result = _.map(extracted, ex => {
        var match = ex[1] || ex[2];
        return {
          start: ex.index,
          end: ex.index + match.length,
          match: ex[0],
          data: match
        }
      });

      if (result.length) return result;
    },

    // Number: must be the last parser to get only the unmatched numbers
    number: function (text, matches, lang) {
      if (!langUtils[lang]) return;

      const INTEGER_WORDS = langUtils[lang].INTEGER_WORDS;
      const INTEGER_WORDS_PATTERN = langUtils[lang].INTEGER_WORDS_PATTERN;
      const CENT_JOIN_PATTERN = langUtils[lang].CENT_JOIN_PATTERN;
      const CENTESIMAL_WORDS_PATTERN = langUtils[lang].CENTESIMAL_WORDS_PATTERN;

      const pattern = new RegExp('\\b(?:(?:(?:[\\.\\,]?\\d+)+|(?:' +
      INTEGER_WORDS_PATTERN +  ')\\s*' +
      CENT_JOIN_PATTERN + '\\s*))+\\b\\s*(?:' +
      CENTESIMAL_WORDS_PATTERN + ')?\\b', 'gi');

      const croped = utils.cropText(text, matches);

      let match;
      const extracted = [];

      while (match = pattern.exec(croped)) {
        extracted.push(match);
      }

      const result = _.map(extracted, (ex) => {
        const numbers = utils.parseNumber(ex[0].split(/\s+/), INTEGER_WORDS);
        return {
          start: ex.index,
          end: ex.index + ex[0].length,
          match: ex[0],
          data: numbers
        }
      });

      if (result.length) return result;
    },
  }
}
