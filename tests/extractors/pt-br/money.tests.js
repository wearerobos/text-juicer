const expect = require('chai').expect;
const money = require('../../../src/extractors/langs/pt-br/money');

describe('Money (PT-BR)', function () {
  it('should return Real (symbol R$)', function () {
    const valid = 'o preço é R$ 55,34. Vai pagar como?';
    const data = [ { start: 9,
                     end: 18,
                     match: ' R$ 55,34',
                     currency: 'R$',
                     data: 55.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Real (symbol $)', function () {
    const valid = 'o preço é $5125,34. Vai pagar como?';
    const data = [ { start: 9,
                     end: 18,
                     match: ' $5125,34',
                     currency: 'R$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Real (symbol R)', function () {
    const valid = 'o preço é R 5125,34. Vai pagar como?';
    const data = [ { start: 9,
                     end: 19,
                     match: ' R 5125,34',
                     currency: 'R$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Real (written "reais")', function () {
    const valid = 'o preço é 5125,34 reais. Vai pagar como?';
    const data = [ { start: 9,
                     end: 23,
                     match: ' 5125,34 reais',
                     currency: 'R$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Real (written "mango")', function () {
    const valid = 'o preço é 5125,34 mango. Vai pagar como?';
    const data = [ { start: 9,
                     end: 23,
                     match: ' 5125,34 mango',
                     currency: 'R$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Real (written "dinheiros")', function () {
    const valid = 'o preço é 5125,34 dinheiros. Vai pagar como?';
    const data = [ { start: 9,
                     end: 27,
                     match: ' 5125,34 dinheiros',
                     currency: 'R$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Real (symbol US$ + reais)', function () {
    const valid = 'o preço é US$ 5125,34 reais. Vai pagar como?';
    const data = [ { start: 9,
                     end: 27,
                     match: ' US$ 5125,34 reais',
                     currency: 'R$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Dolar (symbol USD + R$)', function () {
    const valid = 'o preço é USD 5125,34 R$. Vai pagar como?';
    const data = [ { start: 9,
                     end: 22,
                     match: ' USD 5125,34 ',
                     currency: 'US$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Dolar (symbol US$)', function () {
    const valid = 'o preço é US$ 5125,34. Vai pagar como?';
    const data = [ { start: 9,
                     end: 21,
                     match: ' US$ 5125,34',
                     currency: 'US$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Dolar (symbol USD)', function () {
    const valid = 'o preço é USD 5125,34. Vai pagar como?';
    const data = [ { start: 9,
                     end: 21,
                     match: ' USD 5125,34',
                     currency: 'US$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Dolar (written "dolar")', function () {
    const valid = 'o preço é 5125,34 dolar. Vai pagar como?';
    const data = [ { start: 9,
                     end: 23,
                     match: ' 5125,34 dolar',
                     currency: 'US$',
                     data: 5125.34 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Euro (symbol €)', function () {
    const valid = 'o preço é € 5125. Vai pagar como?';
    const data = [ { start: 9,
                     end: 16,
                     match: ' € 5125',
                     currency: '€',
                     data: 5125 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return Euro (written "euro")', function () {
    const valid = 'o preço é 5125 euros. Vai pagar como?';
    const data = [ { start: 9,
                     end: 20,
                     match: ' 5125 euros',
                     currency: '€',
                     data: 5125 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should return cents', function () {
    const valid = 'o preço é 0,85 reais. Vai pagar como?';
    const data = [ { start: 9,
                     end: 20,
                     match: ' 0,85 reais',
                     currency: 'R$',
                     data: 0.85 } ]
    expect(money(valid)).to.eql(data);
  });

  it('should not return only cents from written number', function () {

  });

  it('should return only cents from number', function () {

  });

  it('should return only cents from number', function () {
    // test R$ 40 quarenta reais e cinco centavos
  });
});
