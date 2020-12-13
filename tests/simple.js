import test from "tape"
import tp from "tape-approximately"
tp(test)
// require('tape-approximately')(test);
import {Parser} from "../src/parser.js"
import {LiteralNumber} from "../src/literalnumber.js"
// var LiteralNumber = require('../src/LiteralNumber').LiteralNumber;
// var moment = require('moment');


function tests(msg,arr) {
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let res = Parser.parseString(str);
            if(res.type === 'funcall') {
                res = res.invoke();
            }
            if(res.type === 'string') {
                return t.equal(res.string, ans);
            }
            return t.approximately(res.getValue(), ans, 0.001);
            return t.equal(res.toString(),ans);
        });
        t.end();
    });
}
function unittests(msg,arr) {
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let res = Parser.parseString(str);
            t.approximately(res.getValue(),ans.getValue(),0.01,'value');
            if(!res.equalUnits(ans)) {
                console.log("not the same units!");
                console.log(res);
                console.log(ans);
            }
            t.equal(res.equalUnits(ans),true);
        });
        t.end();
    });
}

function testsCanonical(msg,arr) {
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let res = Parser.parseString(str);
            t.equal(res.toCanonical().trim(),ans.trim(),'canonical');
        });
        t.end();
    });
}

tests('parsing 42 in different formats', [
	['42',42],
	['4.2',4.2],
	['0x42',0x42],
	['4.2e2',420],
    ['42e2',4200],
    ['42_000_000',42*1000*1000],
    ['42%',0.42],
    ['66.6%',0.666]
]);

/*
testsCanonical('parsing to canonical output', [
    ['42','42'],
    ['0x42','0x42'],
    ['0x42 as decimal','66'],
    //['42 as hex','0x2a']
]);
*/


tests("simple math 2", [
	['4+2',6],
	['4.4+2.2',6.6],
	['4-2',2],
	['4*2',8],
	['4/2',2],
    ['4^2',16],
    ['1+2*3',7],
    ['1+(2*3)',7],
    ['(1+2)*3',9],
    ['(4/3) * 5 ',4/3 * 5],
    ['4 / 3 * 5 ',4/3 * 5],
]);
tests("big numbers", [
    //['4^100',Math.pow(4,100)]
]);


unittests("simple units", [
	['6 feet', new LiteralNumber(6).withUnits('feet')],
    ['6 feet * 6', new LiteralNumber(36).withUnits('feet')],
    ['6 meter', new LiteralNumber(6).withUnit('meter')],
    ['6 cups', new LiteralNumber(6).withUnit('cups')],
    ['40 m', new LiteralNumber(40).withUnit('meter')],
    ['40m', new LiteralNumber(40).withUnit('meter')],
    ['40km as m', new LiteralNumber(40*1000).withUnit('meter')],
    ['40m as feet', new LiteralNumber(131.234).withUnit('foot')],
    ['4 ft',new LiteralNumber(4).withUnit('feet')],
    ['4 ft + 5 ft', new LiteralNumber(9).withUnit('feet')],
    ['4 ft - 5 ft', new LiteralNumber(-1).withUnit('feet')],
    ['4 yards',new LiteralNumber(4).withUnit('yard')],
    ['4 yd',new LiteralNumber(4).withUnit('yard')],
    ['5 km',new LiteralNumber(5).withUnit('kilometer')],
    ['5 km as meters',new LiteralNumber(5000).withUnit('meter')],
    ['5 miles as meters',new LiteralNumber(8046.72).withUnit('meter')],
    ['4 quart as gallon', new LiteralNumber(1).withUnit('gallon')],
    ['16 cups as gallons', new LiteralNumber(1).withUnit('gallon')],
    ['3 teaspoons as tablespoons', new LiteralNumber(1).withUnit('tablespoon')],
    ['2 ft * 2 ft', new LiteralNumber(4).withUnits([['foot',2]])],
    //['2 sqft', new Literal(2).withUnit([['squarefoot'],[]])],
    //['2 cuft', new Literal(2, 'cubicfoot')],
    ['2 TB as GB',new LiteralNumber(2*1000).withUnit('gigabyte')],
    ['2 TiB as GiB',new LiteralNumber(2*1024).withUnit('gibibyte')],
    ['2 MiB as KiB',new LiteralNumber(2*1024).withUnit('kibibyte')],
    ['2 KiB as MiB',new LiteralNumber(2/1024).withUnit('mebibyte')],
    ['2 KB as MB',new LiteralNumber(2/1000).withUnit('megabyte')],
    //['1 GiB as Gibit', new LiteralNumber(8).withUnit('gibibit')],
    //['1 GB as Gbit', new LiteralNumber(8).withUnit('gigabit')]
    ['2 MB as byte',new LiteralNumber(2*1000*1000).withUnit('byte')],
    ['1 kilobyte as byte', new LiteralNumber(1000).withUnit('byte')]
]);


unittests('complex units', [
    ['2ft * 2ft', new LiteralNumber(4).withUnit([['foot',2]])],
    //['2ft * 2ft as sqft', new Literal(4).withUnit('foot',2)],
    ['2 ft^2', new LiteralNumber(2).withUnits([['foot',2]])],
    //['2 ft^2 as sqft', new Literal(2).withUnit('foot',2)],

    ['2ft * 2ft * 2 feet', new LiteralNumber(8).withUnits([['foot',3]])],
    ['2 ft^3', new LiteralNumber(2).withUnit([['foot',3]])],
    //['2 ft^3 as cuft', new Literal(2).withUnit('foot',3)],
    ['2ft * 2ft * 2 feet', new LiteralNumber(8).withUnit([['foot',3]])],
    ['2ft * 2ft * 2ft as gallons', new LiteralNumber(59.8442).withUnit('gallon')],



    ['50 mile', new LiteralNumber(50).withUnit('mile')],
    //['2 feet / second', new Literal(2,'knot',1)],
]);



test("crashed",(t)=>{
    t.throws(()=>{  Parser.parseString("1.2.3"); });
    t.throws(()=>{ Parser.parseString("4a5")});
    t.throws(()=>{ Parser.parseString("4ft + 5")});
    //t.throws(()=>{ Parser.parseString('120m as hours')});
    t.end();
});

unittests("duration units", [
    ["1 second", new LiteralNumber(1).withUnit('second')],
    ['1s', new LiteralNumber(1).withUnit('second')],
    ['120s as minutes', new LiteralNumber(2).withUnit('minute')],
    ['7200s as hours', new LiteralNumber(2).withUnit('hour')],
    ['120min as hours', new LiteralNumber(2).withUnit('hour')],
    ['12 hr as days', new LiteralNumber(0.5).withUnit('day')],
    ['90 days as months', new LiteralNumber(3).withUnit('month')],
    ['730 days as years', new LiteralNumber(2).withUnit('year')],
    ['5 years as seconds', new LiteralNumber(157680000).withUnit('second')]
]);

tests("constants", [
    ['Pi',Math.PI],
    ['pi',Math.PI],
    ['earth.radius as mi',3958.76084],
    ['jupiter.radius as km', 69911]
]);

/*
tests("function calls", [
    ["'foo'", "foo"], //string literal
    ['Date("1975-08-31")', moment('1975-08-31').toString()],
    ['Year(Date("1975-08-31"))', 1975],
    ['WeekDay(Date("1975-08-31"))', 0] //0 is Sunday
]);
*/
tests("lists", [
    //['List(4,5,6)',[4,5,6]],
    //['[4,5,6]',[4,5,6]],
]);

const ER = 6371.008;
unittests("master tests",[
    ['200ft * 600ft as acres',new LiteralNumber(2.75482094).withUnit('acre')],
    ['10ft * 15ft * 8ft as gallons',new LiteralNumber(8976.6).withUnit('gallon')],
    //['0xCAFEBABE as decimal',new Literal(0xCAFEBABE)],
//4. pick a random winner from these four people: Random(List('Alice','Bob','Carl','Dan'))
//'1_000_000 / 26',   // (shows in the canonical form (1 million divided by 26))
//6. ex: how long will it take superman to go around the world?  earth.radius / (4000 feet / second) =

    ['(4000 ft/s)',new LiteralNumber(4000).withUnits(['foot'],['second'])],
    ['(4 ft/s) * 6',new LiteralNumber(24).withUnits(['foot'],['second'])],
    ['6*(4 ft/s)',new LiteralNumber(24).withUnits(['foot'],['second'])],
    ['earth.radius*5',new LiteralNumber(ER*5).withUnits('kilometer')],

    ['6371.008km / (4000 m/s)',new LiteralNumber(6371.008*1000/4000).withUnit('second')],
    ['6371.008 km / (4000 m/s) as hours',new LiteralNumber(6371.008*1000/4000/(60*60)).withUnit('hour')],
    ['earth.radius / (4000 m/s) as hours',new LiteralNumber(6371.008*1000/4000/(60*60)).withUnit('hour')],

//    7. how long does it take light to get from the sun to the earth?  92_000_000 miles / lightspeed = 8 minutes
//8. how long does it take to drive around the world at 60 mph if there was a road that went all around the world? use pi * radius to find circumference in miles, divide by 60mph
//    ['earth.radius * pi / (60 mi/hr)',''],
//9. How many earths could fit inside jupiter? (4/3 * pi * jupiter_radius^2) / (4/3 * pi * earth_radius)
//    ['(4/3*pi*jupiter.radius^3)/(4/3*pi*earth.radius^3)',''],
    //10. what day of the week was I born on? WeekDay(Date("August 31st, 1975"))
    //['WeekDay(Date("1975-08-31"))', 0], //0 is Sunday
//    11. how many songs can I fit on a 1 TB drive? 1 terabyte / average(List(2350kb, 6000kb, 3864kb, 4023kb))
//12. compare the radius of all planets. needs table of planet info. compare(planets.radius) which does the right thing.
//13. compare the population of US states vs their date entering the union
]);