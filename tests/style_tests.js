/**
 * Created by josh on 5/12/17.
 */
var Parser = require('../src/parser.js');
var style = require('../src/styler').style;
//console.log(style(Parser.parseString('45 km')));
//console.log(style(Parser.parseString('9.8 m/s^2')));
//console.log(style(Parser.parseString('4+5')));

Parser.parseStyledExpression('4 + 5');
Parser.parseStyledExpression('45 km');
Parser.parseStyledExpression('45 km^2');
Parser.parseStyledExpression('9.8 m/s^2');
