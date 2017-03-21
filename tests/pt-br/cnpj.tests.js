const expect = require('chai').expect;
const cnpj = require('../../src/extractors/langs/pt-br/cnpj');

describe('CNPJ (PT-BR)', function () {
  it('should return data with valid CNPJ 1', function () {
    const valid = 'cnpj 75.766.358/0001-29 aqui';
    const data = [ { start: 5,
                     end: 23,
                     match: '75.766.358/0001-29',
                     data: '75.766.358/0001-29' } ]
    expect(cnpj(valid)).to.eql(data);
  });

  it('should return data with valid CNPJ 2 (no separation)', function () {
    const valid = 'Tenho 5 CNPJ para passar. 37940365000106 é o primeiro';
    const data = [ { start: 26,
                     end: 40,
                     match: '37940365000106',
                     data: '37.940.365/0001-06' } ];
    expect(cnpj(valid)).to.eql(data);
  });

  it('should return data with valid CNPJ (random separation)', function () {
    const valid = 'No dia 4-3 eu passei meu cnpj: 379. 40/ 3 65/ 0- 0-01/06';
    const data = [ { start: 31,
                     end: 56,
                     match: '379. 40/ 3 65/ 0- 0-01/06',
                     data: '37.940.365/0001-06' } ]
    expect(cnpj(valid)).to.eql(data);
  });

  it('should return undefined (separated with comma)', function () {
    const valid = 'No dia 4-3 eu passei meu cnpj: 37940365,000106';
    expect(cnpj(valid)).to.be.undefined;
  });

  it('should return undefined (invalid CNPJ)', function () {
    const valid = 'No dia 4-3 eu passei meu cnpj: 37940365000107';
    expect(cnpj(valid)).to.be.undefined;
  });

  it('should return undefined (text with no CNPJ)', function () {
    const valid = 'Aqui não tem CNPJ';
    expect(cnpj(valid)).to.be.undefined;
  });

  it('should return 4 CNPJ', function () {
    const valid = 'Eu tenho 4 CNPJs aqui: 75.842.817/0001-06, 52328803000173, 798368 3200/01- 00 e 1-518//9 15 4.0001-/40';
    const data = [ { start: 23,
                     end: 41,
                     match: '75.842.817/0001-06',
                     data: '75.842.817/0001-06' },
                   { start: 43,
                     end: 57,
                     match: '52328803000173',
                     data: '52.328.803/0001-73' },
                   { start: 59,
                     end: 77,
                     match: '798368 3200/01- 00',
                     data: '79.836.832/0001-00' },
                   { start: 80,
                     end: 102,
                     match: '1-518//9 15 4.0001-/40',
                     data: '15.189.154/0001-40' } ]
    expect(cnpj(valid)).to.eql(data);
  });
});
