const expect = require('chai').expect;
const cpf = require('../../src/extractors/langs/pt-br/cpf');

describe('CPF (PT-BR)', function () {
  it('should return data with valid CPF 1', function () {
    const valid = 'cpf 886.144.995-66 aqui';
    const data = [ { start: 4,
                      end: 18,
                      match: '886.144.995-66',
                      data: '886.144.995-66' } ];
    expect(cpf(valid)).to.eql(data);
  });

  it('should return data with valid CPF 2 (no separation)', function () {
    const valid = 'Tenho 5 CPF para passar. 21644447878 é o primeiro';
    const data = [ { start: 25,
                      end: 36,
                      match: '21644447878',
                      data: '216.444.478-78' } ];
    expect(cpf(valid)).to.eql(data);
  });

  it('should return data with valid CPF (random separation)', function () {
    const valid = 'No dia 4-3 eu passei meu cpf: 19.4.8 26.4/24-2-2';
    const data = [ { start: 30,
                      end: 48,
                      match: '19.4.8 26.4/24-2-2',
                      data: '194.826.424-22' } ];
    expect(cpf(valid)).to.eql(data);
  });

  it('should return undefined (separated with comma)', function () {
    const valid = 'No dia 4-3 eu passei meu cpf: 19.4.8, 26.4/24-2-2';
    expect(cpf(valid)).to.be.undefined;
  });

  it('should return undefined (invalid CPF)', function () {
    const valid = 'No dia 4-3 eu passei meu cpf: 18482642422';
    expect(cpf(valid)).to.be.undefined;
  });

  it('should return undefined (text with no CPF)', function () {
    const valid = 'Aqui não tem CPF';
    expect(cpf(valid)).to.be.undefined;
  });

  it('should return 4 CPF', function () {
    const valid = 'Eu tenho 4 CPFs aqui: 077.566.575-43, 30884296393, 304/85.1.1.8904 e 0//36.4/36.27/2-38';
    const data = [ { start: 22,
                     end: 36,
                     match: '077.566.575-43',
                     data: '077.566.575-43' },
                   { start: 38,
                     end: 49,
                     match: '30884296393',
                     data: '308.842.963-93' },
                   { start: 51,
                     end: 66,
                     match: '304/85.1.1.8904',
                     data: '304.851.189-04' },
                  { start: 69,
                    end: 87,
                    match: '0//36.4/36.27/2-38',
                    data: '036.436.272-38' } ]
    expect(cpf(valid)).to.eql(data);
  });
});
