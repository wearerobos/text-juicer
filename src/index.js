const extractors = require('./extractors'),
      _        = require('lodash');

// @param text String
// @param languages Array of Strings
// @param extractors Array of Strings: email, date, phone, money, cep, cnpj, cpf, code, number
exports.extractData = (text, languages = 'pt-br', selection) => {
  const data = {};

  _([languages])
    .compact()
    .flatten()
    .each(lang => {
      const dataLang = {};

      for (let pattern in extractors.commons) {
        if (pattern != 'latest' && (!selection || selection.indexOf(pattern) != -1)) {
          console.log(pattern)
          let ex = extractors.commons[pattern](text, dataLang);
          if (ex) Object.assign(dataLang, { [pattern]: ex });
        }
      }

      for (let pattern in extractors[lang]) {
        if (pattern == 'utils' || (!selection || selection.indexOf(pattern) == -1)) continue;
        console.log('oi', selection)
        console.log(pattern)
        let ex = extractors[lang][pattern](text, dataLang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }

      // Last extractors: get only what wasn't match before (ex: numbers)
      for (let pattern in extractors.commons.latest) {
        if (!selection || selection.indexOf(pattern) == -1) continue;
        console.log(pattern, selection)
        let ex = extractors.commons.latest[pattern](text, dataLang, lang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }

      return data[lang] = dataLang;
    });

    return data;
}

// console.log(JSON.stringify(exports.extractData('testando 11-03', ['pt-br', 'en']), 1, 1));
console.log(JSON.stringify(exports.extractData('vamos fazer com US$ 10 e 5 centavos em 4-9 de manhã', ['pt-br', 'en'], ['number', 'money']), 1, 1));
// console.log(JSON.stringify(exports.extractData('meu cpf é 653, 9944 65075', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('OCORREU ontem, hoje e amanhã', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('meu cpf é 653 198 1203 e setenta mil', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('testando 20-03', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('nine billion seventy million four hundred thousand sixty six', ['pt-br', 'en']), 1, 1));
