const expect = require('chai').expect;
const date = require('../../../src/extractors/langs/pt-br/date');

// TODO fix 'e' on date range (should not trigger alone, just with "entre")

const refDate = new Date('2017-03-21T15:00:00.000Z');

describe('Date (PT-BR)', function () {
  it('should return tomorrow', function () {
    const valid = 'amanhã vou jogar bola';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 6,
                     match: 'amanha',
                     type: 'plain',
                     data: new Date('2017-03-22T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return tomorrow morning', function () {
    const valid = 'quero agendar para amanhã de manhã';
    const data = [ { reference: refDate,
                     start: 19,
                     end: 34,
                     match: 'amanha de manha',
                     type: 'plain',
                     data: new Date('2017-03-22T12:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return range of days', function () {
    const valid = 'gostaria de ir entre dia 5-4 e 8-5';
    const data = [ { reference: refDate,
                     start: 25,
                     end: 34,
                     match: '5-4 e 8-5',
                     type: 'range',
                     data: {
                       start: new Date('2017-04-05T15:00:00.000Z'),
                       end: new Date('2017-05-08T15:00:00.000Z')
                     }
                   } ];
      expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it.skip('should return range of days', function () {
    const valid = 'quarta a noite eu não posso, mas pode ser quinta que vem';
    // console.log(date(valid));
    // const data = [ { reference: refDate,
    //                  start: 25,
    //                  end: 34,
    //                  match: '5-4 e 8-5',
    //                  type: 'range',
    //                  data: {
    //                    start: new Date('2017-04-05T15:00:00.000Z'),
    //                    end: new Date('2017-05-08T15:00:00.000Z')
    //                  }
    //                } ];
    //   expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return today', function () {
    const valid = 'hoje é um bom dia';
    const data = [ { reference: refDate,
                    start: 0,
                    end: 4,
                    match: 'hoje',
                    type: 'plain',
                    data: new Date('2017-03-21T15:00:00.000Z') } ]
      expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it.skip('should return tomorrow with time', function () {
    // If not 'da manhã', use hour as evening
    const valid = 'amanhã as 4 horas, pode ser?';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 11,
                     match: 'amanha as 4',
                     type: 'plain',
                     data: '2017-03-22T04:00:00.000Z' } ]

                   console.log(date(valid, undefined, refDate));
      expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return after tomorrow at night', function () {
    const valid = 'depois de amanhã pela noite';
    const data = [ { reference: refDate,
                    start: 0,
                    end: 27,
                    match: 'depois de amanha pela noite',
                    type: 'plain',
                    data: new Date('2017-03-24T00:00:00.000Z') } ]
      expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return months', function () {
    const valid = 'quero dois em maio e 5 em junho, no dia 3';
    const data = [ { reference: refDate,
                     start: 14,
                     end: 18,
                     match: 'maio',
                     type: 'plain',
                     data: new Date('2017-05-01T15:00:00.000Z') },
                   { reference: refDate,
                     start: 26,
                     end: 31,
                     match: 'junho',
                     type: 'plain',
                     data: new Date('2017-06-01T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return date with day and month ("3 de abril")', function () {
    const valid = 'quero o vencimento para o dia 3 de abril';
    const data = [ { reference: refDate,
                     start: 30,
                     end: 40,
                     match: '3 de abril',
                     type: 'plain',
                     data: new Date('2017-04-03T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return date with day and month ("8/10")', function () {
    const valid = 'pode ser 8/10';
    const data = [ { reference: refDate,
                     start: 9,
                     end: 13,
                     match: '8/10',
                     type: 'plain',
                     data: new Date('2017-10-08T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return some years ago', function () {
    const valid = 'tem 5 anos isso aí';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 10,
                     match: 'tem 5 anos',
                     type: 'plain',
                     data: new Date('2012-03-21T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return future 5 weeks', function () {
    const valid = 'meu aniversaio é daqui 5 semanas';
    const data = [ { reference: refDate,
                     start: 17,
                     end: 32,
                     match: 'daqui 5 semanas',
                     type: 'plain',
                     data: new Date('2017-04-25T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return past months', function () {
    const valid = 'fazem 34 meses que eu não fumo';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 14,
                     match: 'fazem 34 meses',
                     type: 'plain',
                     data: new Date('2014-05-21T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it.skip('should return a year', function () {
    // TODO do 'desde' to return "from time until today"
    const valid = 'desde 1994 que o Brasil usa o Real';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 14,
                     match: 'fazem 34 meses',
                     type: 'plain',
                     data: new Date('2014-05-21T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return next week', function () {
    const valid = 'semana que vem a que horas?';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 14,
                     match: 'semana que vem',
                     type: 'plain',
                     data: new Date('2017-03-28T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return past days', function () {
    const valid = 'tem 5 dias que não durmo em casa';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 10,
                     match: 'tem 5 dias',
                     type: 'plain',
                     data: new Date('2017-03-16T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return past month ("passado")', function () {
    const valid = 'comi peixe no mes passado';
    const data = [ { reference: refDate,
                     start: 14,
                     end: 25,
                     match: 'mes passado',
                     type: 'plain',
                     data: new Date('2017-02-21T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return date ("tomorrow") and past days ("3 dias")', function () {
    const valid = 'amanhã fazem 3 dias que como um pote de Nutella por hora';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 6,
                     match: 'amanha',
                     type: 'plain',
                     data: new Date('2017-03-22T15:00:00.000Z') },
                   { reference: refDate,
                     start: 7,
                     end: 19,
                     match: 'fazem 3 dias',
                     type: 'plain',
                     data: new Date('2017-03-18T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return range of months (jan to dec)', function () {
    const valid = 'entre dezembro e janeiro é 1 meses';
    const data = [ { reference: refDate,
                     start: 6,
                     end: 24,
                     match: 'dezembro e janeiro',
                     type: 'range',
                     data: {
                        start: new Date('2016-12-01T14:00:00.000Z'),
                        end: new Date('2017-01-01T14:00:00.000Z') }
                    } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return range of months (dec to jan)', function () {
    const valid = 'entre janeiro e dezembro são 12 meses';
    const data = [ { reference: refDate,
                     start: 6,
                     end: 24,
                     match: 'janeiro e dezembro',
                     type: 'range',
                     data: {
                        start: new Date('2017-01-01T14:00:00.000Z'),
                        end: new Date('2017-12-01T14:00:00.000Z') }
                    } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return date (written month)', function () {
    const valid = 'agenda para mim para o dia 04 de fevereiro';
    const data = [ { reference: refDate,
                     start: 27,
                     end: 42,
                     match: '04 de fevereiro',
                     type: 'plain',
                     data: new Date('2017-02-04T14:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return date calculated date for invalid date', function () {
    const valid = 'agenda para mim para o dia 40 de fevereiro';
    const data = [ { reference: refDate,
                     start: 27,
                     end: 42,
                     match: '40 de fevereiro',
                     type: 'plain',
                     data: new Date('2017-03-12T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return date (next weekday)', function () {
    const valid = 'proxima terça parece uma boa';
    const data = [ { reference: refDate,
                     start: 0,
                     end: 13,
                     match: 'proxima terca',
                     type: 'plain',
                     data: new Date('2017-03-28T15:00:00.000Z') } ]
    expect(date(valid, undefined, refDate)).to.eql(data);
  });

  it('should return undefined (no date)', function () {
    const valid = 'sem data nenhuma aqui';
    expect(date(valid, undefined, refDate)).to.be.undefined;
  });
});
