This the parser for [Tallycat](https://apps.josh.earth/tallycat/). 
It uses a parser grammar using [OhmJS](https://ohmlang.github.io).  Try the live demo at
[https://apps.josh.earth/tallycat/](https://apps.josh.earth/tallycat/).

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

`Parser.parseString` returns a `LiteralNumber` object. To get the numeric value call `getValue()`. To print the rest of the structure call:

```javascript
console.log(result.getValue())
result._numers.forEach(n => {
    console.log(n.getName(),n.getDimension(),n.getFactor())
})
result._denoms.forEach(n => {
    console.log(n.getName(),n.getDimension(),n.getFactor())
})

```

### Other Features

Render result as simple styled HTML with `Parser.parseStyledExpression(str)`. Get it as
a tree with `Parser.parseTree(str)`.


### Room for improvement:

* If the parse fails it will throw an error. The error should really give you info about where it failed so the user could be presented with options to fix it, especially for incomplete parses.
* At one point it supported constants like PI and earth.radius which is useful for complex queries like calculating _how long it would take Superman to fly
      around the world_ or _how much rum is in a gallon of my favorite mai-tai mix'_.
* It supports functions to convert dates and durations, but this is less tested and documented.
* The units and functions should have generated API docs. I don't know how to set this up and would love someone to set up a continuous integration service to build it.

  
### Development

Run the unit tests with

```shell
npm test
```

