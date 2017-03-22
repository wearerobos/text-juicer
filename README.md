# Text juicer :tropical_drink:

This module extracts entities (juice :tropical_drink:) from a text string using Regex.

> Entities are: e-mail, phones, numbers, dates, money, national ID...

## Usage

Import Text Juicer and use it passing a text and the language it should use as a String or Array of Strings (it will iterate over them all).

If you want, you can select what "extractor" to use passing a third argument to the Text Juicer.

````
const textJuicer = require('text-juicer');

// Passing just text (Default -> language: 'pt-br', extractors: all)
const extracted1 = textJuicer.parseData('My text goes here');
// Selecting EN language
const extracted2 = textJuicer.parseData('My text goes here', 'en');
// Selecting 'pt-br' and 'email' extractor
const extracted3 = textJuicer.parseData('My text goes here', 'pt-br', 'email');
// Selecting lang: 'pt-br' and 'en' / extractors: 'email' and 'phone
const extracted4 = textJuicer.parseData('My text goes here', ['pt-br', 'en'], ['email', 'phone']);
````

What "juice" may you extract from your text?

#### EN

* E-mails
* Dates
* Money values
* Phone numbers
* Zip codes
* Numbers
* Codes (like protocol codes)

#### PT-BR

* E-mails
* Dates
* CPF
* CNPJ
* Money values
* Phone numbers
* CEP
* Numbers
* Codes (like protocol codes)

## Results

Each component might have it own way of returning data, but all of them follow this default structure:

````
{
  "language": {
    "entity 1": [
     { // First element found for this entity
      "start": Starting index in String,
      "end": Ending index in String,
      "match": Matched text,
      "data": Extracted Data
     },
     { // Second element found for this entity
      "start": Starting index in String,
      "end": Ending index in String,
      "match": Matched text,
      "data": Extracted Data
     }
    ],
   "entity 2": [ ... ]
  },
  "language 2": { ... }
}
````

Above are the particularities for each extractor.

#### Date

`reference`: date used as reference for parser (check Chrono documentation: https://github.com/wanasit/chrono).

`type`: if data is a single date (`plain`) or a range (`range`). If range, there will be an Array with `start` and `end` properties for the range.

````
"date": [
 {
  "reference": "2017-03-22T02:37:37.537Z",
  "start": 39,
  "end": 42,
  "match": "4-9",
  "type": "range",
  "data": {
   "start": "2017-03-21T07:00:00.000Z",
   "end": "2017-03-21T12:00:00.000Z"
  }
 }
]
````

#### Money

`currency`: currency of the value (`data`).

````
"money": [
 {
  "start": 16,
  "end": 32,
  "match": "US$ 10 e 5 cents",
  "currency": "US$",
  "data": 10.05
 }
]
````

#### Phone

`data.countryCode`: Phone's country code (default: +55 [Brazil]).

`data.areaCode`: Phone's area code.

`data.phone`: Phone number.

````
"phone": [
 {
  "start": 10,
  "end": 23,
  "match": "078 55015 680",
  "data": {
   "countryCode": "+55",
   "ddd": "07",
   "phone": "85501-5680"
  }
 }
]
````

#### Number

Numbers `data` is always given as an Array, since it might have a sequence of numbers.

````
"number": [
 {
  "start": 25,
  "end":41,
  "match": "seventy thousand 4532",
  "data": [
   70000,
   4532
  ]
 }
]
````

### Considerations

#### Numbers
Numbers are always extracted last and only on the text's "residue". This is because you may have money and dates in your text, and it shouldn't be mistaken by a "number value".

````
textJuicer.extractData('I spent $ 54,00 on this shirt, but I will use it only in 5 days', ['en']);

// Returns date and money, but no number
{
 "en": {
  "date": [
   {
    "reference": "2017-03-22T03:16:22.130Z",
    "start": 54,
    "end": 63,
    "match": "in 5 days",
    "type": "plain",
    "data": "2017-03-27T15:00:00.000Z"
   }
  ],
  "money": [
   {
    "start": 7,
    "end": 16,
    "match": " $ 54,00 ",
    "currency": "US$",
    "data": 5400
   }
  ]
 }
}
````

Another important thing about numbers is that you may get **written numbers**! *(Only in Brazilian Portuguese for now)*

````
juiceParser.extractData('meu numero da sorte é cinquenta mil quinhentos e setenta e sete');

// Returns
{
 "pt-br": {
  "number": [
   {
    "start": 22,
    "end": 63,
    "match": "cinquenta mil quinhentos e setenta e sete",
    "data": [
     50577
    ]
   }
  ]
 }
}
````

## Contributing
You are very welcome to contribute to Text Juicer!

We style our code based on Airbnb eslint style (check the guide: https://github.com/airbnb/javascript).

Please, test your pull requests. We are using Mocha and Chai for testing.

Any doubt, feel free to ask.

## License

MIT License

Copyright (c) 2017 ROBOS.im https://robos.im

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
