const expect = require('chai').expect;
const cep = require('../../src/extractors/langs/pt-br/cep');

describe('CEP (PT-BR)', function () {
  it('should return data with 1 CEP', function () {
    const valid = 'cep 30175912 aqui';
    const data = [ { start: 4,
                      end: 12,
                      match: '30175912',
                      data: '30175-912' } ];
    expect(cep(valid)).to.eql(data);
  });

  it('should return undefined (more than 8 numbers)', function () {
    const valid = 'cep 301759121';
    expect(cep(valid)).to.be.undefined;
  });

  it('should return undefined (less than 8 numbers)', function () {
    const valid = 'cep 3075912';
    expect(cep(valid)).to.be.undefined;
  });

  it('should return 1 CEP (in the middle of invalid CEPs)', function () {
    const valid = 'cep 3075912 12389102 129128312';
    const data = [ { start: 12, end: 20, match: '12389102', data: '12389-102' } ];
    expect(cep(valid)).to.be.eql(data);
  });

  it('should return data with 3 CEP', function () {
    const valid = 'cep 30175912 aqui 12389098 12839129';
    const data = [ { start: 4, end: 12, match: '30175912', data: '30175-912' },
                   { start: 18, end: 26, match: '12389098', data: '12389-098' },
                   { start: 27, end: 35, match: '12839129', data: '12839-129' } ]
    expect(cep(valid)).to.eql(data);
  });

  it('should return undefined (separated with commas and dots)', function () {
    const valid = 'cep 301759,12 aqui 128.39129';
    expect(cep(valid)).to.be.undefined;
  });

  it('should return CEP (separated with bar)', function () {
    const valid = 'cep 30175/912';
    const data = [ { start: 4, end: 13, match: '30175/912', data: '30175-912' } ];
    expect(cep(valid)).to.eql(data);

  });

  it('should return CEP (separated with dot)', function () {
    const valid = 'cep 30175.912';
    const data = [ { start: 4, end: 13, match: '30175.912', data: '30175-912' } ];
    expect(cep(valid)).to.eql(data);
  });

  it('should return CEP (separated with dash)', function () {
    const valid = 'cep 30175-912';
    const data = [ { start: 4, end: 13, match: '30175-912', data: '30175-912' } ];
    expect(cep(valid)).to.eql(data);
  });

  it('should return no CEP (wrong separation)', function () {
    const valid = 'cep 3017-5912';
    expect(cep(valid)).to.be.undefined;
  });
});
