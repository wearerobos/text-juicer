'use nodent-promises';

const patterns = require('./patterns'),
      _        = require('lodash');

// @param languages String
// @param languages Array of Strings
exports.extractData = (text, languages) => {

  const data = {};
  const langs = languages || 'pt-br';

  for (let pattern in patterns.commons) {
    if (pattern != 'latest') {
      let ex = patterns.commons[pattern](text, data);
      if (ex) Object.assign(data, { [pattern]: ex });
    }
  }

  let language = _([langs]).compact().flatten();
  language.each((lang) => {
    for (let pattern in patterns[lang]) {
      if (pattern == 'utils') continue;
      let ex = patterns[lang][pattern](text, data);
      if (ex) Object.assign(data, { [pattern]: ex });
    }
    // Last patterns: get only what wasn't match before (ex: numbers)
    for (let pattern in patterns.commons.latest) {
      let ex = patterns.commons.latest[pattern](text, data, lang);
      if (ex) Object.assign(data, { [pattern]: ex });
    }
  });

  return data;
}


// console.log(exports.extractData('meu email é julianopenna@gmail.com, tenho 25 anos, faço aniversario dia 21/03/1991 que é amanha e meu cpf é 07855015680 e 07855015680 e 07855015680 comi muita prexeca entre ontem e hoje. mas segunda eu tenho sessenta reais e trinta centavos para fazer isso.'));
console.log(exports.extractData('sessenta reais e trinta centavos para fazer isso.'));
// console.log(exports.extractData('meu telefone é 3491972227 ou o de bh 31994465075, meu numero de protocolo XFIE123BR'));
// console.log(exports.extractData('quero R$ 50,00 pela camera, ou 76,00 por todos'));
