/*
//merge num into Literal, then rename to LiteralNumber
merge unit can calcs into Units class. write with just the new structure. contains
1) a list of units with name, nicnkames, and types
2) a list of conversions from one named unit to another with ratios and dimensions
 */

/**
 * Created by josh on 5/2/17.
 */
var test = require('tape');
//require('tape-approximately')(test);
var Literal = require('../src/Literal').Literal;
var Parser = require('../src/parser.js');
/*
var ER = 6371.008;
unittests("master tests",[
    ['pi+1',new Literal(Math.PI+1)],
    ['pi*2',new Literal(Math.PI*2)],
    ['earth.radius * 5',new Literal(ER*5).withComplexUnit(['kilometer'],[])],
    ['3ft * (1 ft/s)',new Literal(3).withComplexUnit(['foot','foot'],['second'])],
    ['3ft / (1 ft/s)',new Literal(3).withComplexUnit(['foot','second'],['foot'])],
    ['1m / (1 ft/s) as ft',new Literal(1).withComplexUnit(['meter','second'],['foot'])],
]);
*/

test("literal class tests", (t) => {
    t.equal(new Literal(10,['meter']).toString(),'10meter');
    t.equal(new Literal(6,['kilometer']).as('meter').toString(),'6000meter');
    t.equal(new Literal(10,['second']).multiply(new Literal(5,['meter'],1,['second'])).toString(),'50meter');
    t.equal(new Literal(10,['second']).multiply(new Literal(9.8,['meter'],1,['second','second'])).toString(),'98meter/second');
    t.equal(new Literal(4000,['mile']).multiply(new Literal(1,['hour'],40,['mile'])).toString(),'100hour');
    t.equal(new Literal(600*1000,['meter']).multiply(new Literal(1,['hour'],40,['mile'])).toString(),'9.32hour');
    t.equal(new Literal(3,['foot']).multiply(new Literal(3,['foot'])).multiply(new Literal(3,['foot'])).as('gallon').toString(),'201.97gallon');
    t.end();
});

test("master tests",(t) => {
    t.equal(Parser.parseString('10 meter').toString(),'10meter');
    t.equal(Parser.parseString('6 kilometer as meter').toString(),'6000meter');
    t.equal(Parser.parseString('10 second * 5 meter/second').toString(),'50meter');
    t.equal(Parser.parseString('10 second * 9.8 meter/second^2').toString(),'98meter/second');
    t.equal(Parser.parseString('4000 mile * 1 hour / 40 mile').toString(),'100hour');
    t.equal(Parser.parseString('4000 mile / (40 mile/hour)').toString(),'100hour');
    t.equal(Parser.parseString('600000 meter / (40 mile/hour)').toString(),'9.32hour');
    t.equal(Parser.parseString('3 foot * 3 foot * 3 foot as gallon').toString(),'201.97gallon');
    t.equal(Parser.parseString('3 ft * 3 ft * 3 ft as gallon').toString(),'201.97gallon');
    t.equal(Parser.parseString('3ft / 1ft/s').toString(),'3second');
    t.equal(Parser.parseString('3ft * 1ft/s').toString(),'3foot foot/second');
    //crashes the stack t.equal(Parser.parseString('1m/(1ft/s)').toString(),'1second');
    t.end();
});
