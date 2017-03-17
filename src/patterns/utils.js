const _ = require('lodash');
const numeral = require('numeral');
const numeralLocales = require('numeral/locales/pt-br'); // To get all locales, remove pt-br

numeral.locale('pt-br');

exports.cropText = function (text, matches) {
  let croped = text;

  _.each(matches, (group) => {
    _.each(group, (matched) => {
      if (!matched) return;
      const spaces = _.repeat(' ', matched.match.length);
      croped = croped.replace(matched.match, spaces);
    });
  });
  return croped;
}

// TODO improve logic and organization
// Get writen numbers and transform it in one value
exports.parseNumber = function (nums, integerWordsPattern) {
  const numbers = _(nums).map((n) => {
    // If real number, identify element putting inside an array
    if (Number.parseInt(n)) return [numeral(n).value()];
    if (integerWordsPattern[n] === 0) return [integerWordsPattern[n]];
    if (integerWordsPattern[n]) {
      return integerWordsPattern[n];
    } else if (/^[cs]ent|cento$|%/.test(n)) {
      return 'cents';
    }
  }).compact().value();

  if (numbers.length == 0) return;

  let thisTotal;
  let lastNum;
  let bundles = [];

  numbers.forEach((n) => {
    // If n was number at start, don't do anything
    if (_.isArray(n)) {
      bundles.push(n, 0);
      lastNum = 0;
      return thisTotal = 0;
    }

    // thisTotal: last calculated number from loop
    thisTotal = bundles.pop() || 0;
    // lastNum: previous number of this "bundle"
    lastNum = lastNum || thisTotal;

    // If thisTotal is decimal number, this total is done and start new 1"bundle" with n
    if (thisTotal % 1 != 0) {
      lastNum = n;
      bundles.push(thisTotal);
      return bundles.push(n);
    }

    // If n is "cents", then the previous number the centesimal part of thisTotal
    if (n == 'cents') {
      lastNum = 0;
      const int = bundles.pop() || 0;
      if (_.isArray(int)) {
        thisTotal = bundles.pop();
        if (thisTotal && _.isArray(thisTotal)) thisTotal = thisTotal[0];
        int = int[0];
        const cent = int * 0.01;
        thisTotal ? bundles.push(_.round(thisTotal + int * 0.01, 2)) : bundles.push(_.round(int * 0.01, 2))
      }
      bundles.push(_.round(int + thisTotal * 0.01, 2));
      return bundles.push(0); // Set next thisTotal to 0
    }

    // If lastNum is smaller than n, n might be a multiplier or a start of a new "bundle"
    if (lastNum) var div = lastNum / n;
    if ((div < 1 && div > 0.1) || (1/div < 1 && 1/div > 0.1) || div < 0.1) {
      // Check if it is a multiplier (thousands, millions..): 1000, 1000000...
      if (n % 100 == 0 && n / 100 > 1 && n.toString()[0] == 1 ) {
        lastNum = 0; // Start lastNum as thisTotal on next loop
        thisTotal = thisTotal || 1; // If first loop of "bundle", thisTotal must be 1
        bundles.push(thisTotal * n);
        return bundles.push(0);
      }
      // If not multiplier, start new number "bundle"
      bundles.push(thisTotal);
      return bundles.push(n);
    }

    // If lastNumber is bigger than n, then it is a parcel of the number "bundle"
    lastNum = n;
    return bundles.push(thisTotal + n);
  });

  // Remove any undefined values
  bundles = _.compact(bundles);

  let lastBundle = 0;
  let calculated = 0;
  const results = [];

  bundles.forEach((n, key) => {
    // If n was number at start, don't change
    if (_.isArray(n)) {
      results.pop();
      calculated && results.push(calculated);
      results.push(n[0], 0);
      if (key === bundles.length - 1) results.pop();
      lastBundle = 0;
      return calculated = 0;
    }

    calculated = results.pop() || 0;
    // If total is decimal, start calculating new number on next loop
    if (calculated % 1 != 0) {
      lastBundle = n;
      results.push(calculated);
      return results.push(n);
    }

    // If lastBundle has order of magnitude equal or less than n, start calculating new number on next loop
    if (lastBundle && lastBundle.toString().length <= Number.parseInt(n).toString().length) {
      results.push(numeral(calculated).value());
      lastBundle = 0;
      calculated = 0;
    }
    // Else continue calculating number (sum total (ex: 700) and n (ex: 70))
    calculated += n;
    lastBundle = n;
    results.push(numeral(calculated).value());
  });

  return results;
}
