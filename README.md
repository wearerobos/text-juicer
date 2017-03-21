# Text juicer :tropical_drink:

This module extracts entities (juice :tropical_drink:) from a text string using Regex.

> Entities are: e-mail, phones, numbers, dates, money, national ID...

## Usage

Import extractor and use it passing a text and the language it should use as a String or Array of Strings (it will iterate over them all).
If language is not passed, it defaults to pt-br (Brazilian Portuguese).

    const extractor = require('extractor');

    const extracted = extractor.parseData('My text goes here', 'pt-br');

### Result

The parsed content is returned in the following structure:

  
