const patterns = require('./patterns'),
      _        = require('lodash');

// @param languages String
// @param languages Array of Strings
exports.extractData = (text, languages = 'pt-br') => {

  // _([languages])
  //   .compact()
  //   .flatten()
  //   .map(lang => {
  //     const dataLang = data[lang] = {};
  //
  //     for (let pattern in patterns.commons) {
  //       if (pattern != 'latest') {
  //         let ex = patterns.commons[pattern](text, dataLang);
  //         if (ex) Object.assign(dataLang, { [pattern]: ex });
  //       }
  //     }
  //
  //     for (let pattern in patterns[lang]) {
  //       if (pattern == 'utils') continue;
  //       let ex = patterns[lang][pattern](text, dataLang);
  //       if (ex) Object.assign(dataLang, { [pattern]: ex });
  //     }
  //
  //     // Last patterns: get only what wasn't match before (ex: numbers)
  //     for (let pattern in patterns.commons.latest) {
  //       let ex = patterns.commons.latest[pattern](text, dataLang, lang);
  //       if (ex) Object.assign(dataLang, { [pattern]: ex });
  //     }
  //   })

  const data = {};
  let langs = _([languages]).compact().flatten();

  langs.each((lang) => {
    const dataLang = data[lang] = {};

    for (let pattern in patterns.commons) {
      if (pattern != 'latest') {
        let ex = patterns.commons[pattern](text, dataLang);
        if (ex) Object.assign(dataLang, { [pattern]: ex });
      }
    }

    for (let pattern in patterns[lang]) {
      if (pattern == 'utils') continue;
      let ex = patterns[lang][pattern](text, dataLang);
      if (ex) Object.assign(dataLang, { [pattern]: ex });
    }

    // Last patterns: get only what wasn't match before (ex: numbers)
    for (let pattern in patterns.commons.latest) {
      let ex = patterns.commons.latest[pattern](text, dataLang, lang);
      if (ex) Object.assign(dataLang, { [pattern]: ex });
    }
  });

  return data;
}
