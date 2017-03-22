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

// console.log(JSON.stringify(exports.extractData('testando 11-03', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('vamos fazer com US$ 10 e 5 centavos em 4-9 de manhã', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('I spent $ 54,00 on this shirt, but I will use it only in 5 days', ['en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('vamos fazer com US$ 10 e 5 centavos em 4-9 de manhã', ['pt-br', 'en'], ['date']), 1, 1));
// console.log(JSON.stringify(exports.extractData('vamos fazer com US$ 10 e 5 centavos em 4-9 de manhã', ['pt-br', 'en'], 'money'), 1, 1));
console.log(JSON.stringify(exports.extractData('meu numero da sorte é cinquenta mil quinhentos e setenta e sete'), 1, 1));
// console.log(JSON.stringify(exports.extractData('meu cpf é 078 55015 680', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('OCORREU ontem, hoje e amanhã', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('meu cpf é 653 198 1203 e setenta mil 453', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('testando 20-03', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('nine billion seventy million four hundred thousand sixty six', ['pt-br', 'en']), 1, 1));
