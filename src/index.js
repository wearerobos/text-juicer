const extractors = require('./extractors'),
      _        = require('lodash');

// @param text String
// @param languages Array of Strings
// @param extractors Array of Strings: email, date, phone, money, cep, cnpj, cpf, code, number
exports.extractData = (text, languages = 'pt-br', selection) => {
  const data = {};
  selection = _([selection]).flatten().map(ex => ex && ex.toLowerCase()).compact().value();

  _([languages])
    .compact()
    .flatten()
    .each(lang => {
      const dataLang = {};
      lang = lang.toLowerCase();

      for (let pattern in extractors.commons) {
        if (pattern != 'latest' && (!selection.length || selection.indexOf(pattern) != -1)) {
          let ex = extractors.commons[pattern](text, dataLang);
          if (ex) Object.assign(dataLang, { [pattern]: ex });
        }
      }

      for (let pattern in extractors[lang]) {
        if (pattern == 'utils' || (selection.length && selection.indexOf(pattern) == -1)) continue;
        let ex = extractors[lang][pattern](text, dataLang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }

      // Last extractors: get only what wasn't match before (ex: numbers)
      for (let pattern in extractors.commons.latest) {
        if (selection.length && selection.indexOf(pattern) == -1) continue;
        let ex = extractors.commons.latest[pattern](text, dataLang, lang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }

      return data[lang] = dataLang;
    });

    return data;
}
