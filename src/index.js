const extractors = require('./extractors'),
      _        = require('lodash');

// @param languages String
// @param languages Array of Strings
exports.extractData = (text, languages = 'pt-br') => {
  return _([languages])
    .compact()
    .flatten()
    .map(lang => {
      const dataLang = {};

      for (let pattern in extractors.commons) {
        if (pattern != 'latest') {
          let ex = extractors.commons[pattern](text, dataLang);
          if (ex) Object.assign(dataLang, { [pattern]: ex });
        }
      }

      for (let pattern in extractors[lang]) {
        if (pattern == 'utils') continue;
        let ex = extractors[lang][pattern](text, dataLang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }

      // Last extractors: get only what wasn't match before (ex: numbers)
      for (let pattern in extractors.commons.latest) {
        let ex = extractors.commons.latest[pattern](text, dataLang, lang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }

      return { [lang]: dataLang };
    })
    .value()[0];
}

// console.log(JSON.stringify(exports.extractData('testando 20-03', ['pt-br', 'en']), 1, 1));
console.log(JSON.stringify(exports.extractData('vamos fazer com 10 reais e 5 centavos em 4-9 de manhã', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('meu cpf é 653, 9944 65075', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('OCORREU ontem, hoje e amanhã', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('meu cpf é 653 198 1203 e setenta mil', ['pt-br', 'en']), 1, 1));
// console.log(JSON.stringify(exports.extractData('testando 20-03', ['pt-br', 'en']), 1, 1));