const expect = require('chai').expect;
const phone = require('../../../src/extractors/langs/pt-br/phone');

describe('Phone (PT-BR)', function () {
  it('should return without DDD', function () {
    const valid = 'meu numero é 39021232';
    const data = [ { start: 13,
                    end: 21,
                    match: '39021232',
                    data: { countryCode: '+55', areaCode: undefined, phone: '3902-1232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return with DDD', function () {
    const valid = 'meu numero é 3439021232';
    const data = [ { start: 13,
                    end: 23,
                    match: '3439021232',
                    data: { countryCode: '+55', areaCode: '34', phone: '3902-1232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return DDD 4-5 format', function () {
    const valid = 'meu numero é 343902-91232';
    const data = [ { start: 13,
                    end: 25,
                    match: '343902-91232',
                    data: { countryCode: '+55', areaCode: '34', phone: '39029-1232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return no DDD 4-5 format', function () {
    const valid = 'meu numero é 3902-91232';
    const data = [ { start: 13,
                    end: 23,
                    match: '3902-91232',
                    data: { countryCode: '+55', areaCode: undefined, phone: '39029-1232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return DDD 5-4 format', function () {
    const valid = 'meu numero é 3139029-1232';
    const data = [ { start: 13,
                    end: 25,
                    match: '3139029-1232',
                    data: { countryCode: '+55', areaCode: '31', phone: '39029-1232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return no DDD 5-4 format', function () {
    const valid = 'meu numero é (41)34902-9232';
    const data = [ { start: 14,
                    end: 27,
                    match: '41)34902-9232',
                    data: { countryCode: '+55', areaCode: '41', phone: '34902-9232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return DDD 4-4 format', function () {
    const valid = 'meu numero é (41)3490-9232';
    const data = [ { start: 14,
                    end: 26,
                    match: '41)3490-9232',
                    data: { countryCode: '+55', areaCode: '41', phone: '3490-9232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return no DDD 4-4 format', function () {
    const valid = 'meu numero é 3490-9232';
    const data = [ { start: 13,
                    end: 22,
                    match: '3490-9232',
                    data: { countryCode: '+55', areaCode: undefined, phone: '3490-9232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return phone (wrong separated)', function () {
    const valid = 'meu numero é 349-0-923-2';
    const data = [ { start: 13,
                    end: 24,
                    match: '349-0-923-2',
                    data: { countryCode: '+55', areaCode: undefined, phone: '3490-9232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return given country code', function () {
    const valid = 'meu numero é 6731349-0-923-2';
    const data = [ { start: 13,
                    end: 28,
                    match: '6731349-0-923-2',
                    data: { countryCode: '+67', areaCode: '31', phone: '3490-9232' } } ];
    expect(phone(valid)).to.eql(data);
  });

  it('should return undefined (no phone)', function () {
    const valid = 'meu numero é sem numero';
    expect(phone(valid)).to.be.undefined;
  });

  it('should return undefined (comma separated)', function () {
    const valid = 'meu numero é (41)349,02-9232';
    expect(phone(valid)).to.be.undefined;
  });

  it('should return undefined (dot separated)', function () {
    const valid = 'meu numero é (41)349.02-9232';
    expect(phone(valid)).to.be.undefined;
  });
});
