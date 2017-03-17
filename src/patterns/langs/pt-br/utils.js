exports.validateCPF = (cpf) => {
  const cpfNum = cpf.replace(/[^\d]+/g, '');
  let check, add;

  if (cpfNum == '') return false;
  // Eliminate known invalid CPFs
  if (cpfNum.length != 11 ||
      cpfNum == "00000000000" ||
      cpfNum == "11111111111" ||
      cpfNum == "22222222222" ||
      cpfNum == "33333333333" ||
      cpfNum == "44444444444" ||
      cpfNum == "55555555555" ||
      cpfNum == "66666666666" ||
      cpfNum == "77777777777" ||
      cpfNum == "88888888888" ||
      cpfNum == "99999999999")
          return false;
  // Validate 1st digit
  add = 0;
  for (i=0; i < 9; i ++) {
    add += parseInt(cpfNum.charAt(i)) * (10 - i);
  }

  check = 11 - (add % 11);
  if (check == 10 || check == 11)
    check = 0;
  if (check != parseInt(cpfNum.charAt(9)))
    return false;

  // Validate 2nd digit
  add = 0;
  for (i = 0; i < 10; i ++) {
    add += parseInt(cpfNum.charAt(i)) * (11 - i);
  }

  check = 11 - (add % 11);
  if (check == 10 || check == 11)
    check = 0;
  if (check != parseInt(cpfNum.charAt(10)))
    return false;

  return true;
}

exports.validateCNPJ = (cnpjNum) => {
    const cnpj = cnpjNum.replace(/[^\d]+/g,'');
    let size, numbers, digits, sum;

    if(cnpj == '') return false;

    if (cnpj.length != 14) return false;

    // Eliminate known invalid CNPJs
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
          return false;

    // Validate DVs
    size = cnpj.length - 2;
    numbers = cnpj.substring(0,size);
    digits = cnpj.substring(size);
    sum = 0;
    pos = size - 7;
    for (i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (resultado != digits.charAt(0))
      return false;

    size = size + 1;
    numbers = cnpj.substring(0,size);
    sum = 0;
    pos = size - 7;
    for (i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (resultado != digits.charAt(1))
      return false;

    return true;
}

exports.INTEGER_WORDS = {
    'zero': 0,
    'um': 1,
    'uma': 1,
    'dois': 2,
    'duas': 2,
    'três': 3,
    'tres': 3,
    'quatro': 4,
    'cinco': 5,
    'seis': 6,
    'sete': 7,
    'oito': 8,
    'nove': 9,
    'dez': 10,
    'onze': 11,
    'doze': 12,
    'treze': 13,
    'catorze': 14,
    'quatorze': 14,
    'quinze': 15,
    'dezesseis': 16,
    'dezesete': 17,
    'dezoito': 18,
    'dezenove': 19,
    'vinte': 20,
    'trinta': 30,
    'quarenta': 40,
    'cuarenta': 40,
    'cinquenta': 50,
    'sessenta': 60,
    'secenta': 60,
    'cecenta': 60,
    'setenta': 70,
    'oitenta': 80,
    'noventa': 90,
    'cem': 100,
    'cento': 100,
    'duzentos': 200,
    'trezentos': 300,
    'quatrocentos': 400,
    'quinhentos': 500,
    'seissentos': 600,
    'seiscentos': 600,
    'seicentos': 600,
    'setecentos': 700,
    'oitocentos': 800,
    'novecentos': 900,
    'mil': 1000,
    'milhares': 1000,
    'milhar': 1000000,
    'milhao': 1000000,
    'milhão': 1000000,
    'milhões': 1000000,
    'milhoes': 1000000,
    'bilhão': 1000000000,
    'bilhao': 1000000000,
    'bilhões': 1000000000,
    'bilhoes': 1000000000,
    'trilhao': 1000000000000,
    'trilhão': 1000000000000,
    'trilhões': 1000000000000,
    'trilhoes': 1000000000000,
};

exports.CENT_JOIN_PATTERN = 'e';
exports.CENTESIMAL_WORDS_PATTERN = '[sc]ent[ée][sz]imos?|cents?|%|p[eo]r\\s*cento';
exports.INTEGER_WORDS_PATTERN = Object.keys(exports.INTEGER_WORDS).join('|');
