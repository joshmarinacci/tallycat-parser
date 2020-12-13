This the parser for [Tallycat](https://apps.josh.earth/tallycat/). 
It uses a parser grammar using [OhmJS](https://ohmlang.github.io)

The parser can do arithmetic (+ - / *) on numbers with units. For example the string `2ft * 3` will return
`6 feet` as an object. It understand common imperial and metric units for length, weight, time, area,
volume, and more.

Here's a few more simple examples.


```
2ft * 2ft * 2ft as gal => 59.8442 gallons
2 TB as GB => 2000 gigabytes
2 TiB as GiB => 2048 gibibytes
5 years as seconds => 157680000 seconds
```


Use the library from node like this:

```javascript

import {Parser} from "tallycat-parser";

let result = Parser.parseString('4ft * 6');
console.log(result.toString())
// prints Literal 24 1*foot^1 / 
```

`Parser.parseString` returns a `LiteralNumber` object. To get the numeric value call 'getValue()'

