/**
 * Created by josh on 5/16/17.
 */
var test = require('tape');
var compareComplexUnit = require('./common').compareComplexUnit;
var LiteralNumber = require('../src/LiteralNumber').LiteralNumber;


test("complex units",(t)=>{
    compareComplexUnit(t, '1ft/s', new LiteralNumber(1).withUnits([['foot',1]],[['second',1]]));
    compareComplexUnit(t,'3ft * (1ft/s)', new LiteralNumber(3).withUnits([['foot',2]],[['second',1]]));
    compareComplexUnit(t,'3ft / (1 ft/s)',new LiteralNumber(3).withUnits([['second',1]]));
    compareComplexUnit(t,'3ft / (1 ft/s) as second',new LiteralNumber(3).withUnits('second'));
    compareComplexUnit(t,'3ft / (1 ft/min) as second',new LiteralNumber(3*60).withUnit('second'));
    compareComplexUnit(t,'1m / (1ft/s)', new LiteralNumber(3.28084).withUnit([['second',1]],[]));
    compareComplexUnit(t,'60 miles', new LiteralNumber(60).withUnit('mile'));
    compareComplexUnit(t,'60 miles/hour', new LiteralNumber(60).withUnit(['mile'],['hour']));
    compareComplexUnit(t,'60 miles/hour * 2', new LiteralNumber(120).withUnit(['mile'],['hour']));
    compareComplexUnit(t,'2*60 miles/hour * 1', new LiteralNumber(120).withUnit(['mile'],['hour']));
    compareComplexUnit(t,'60 min * 60 mi/hr', new LiteralNumber(60).withUnit(['mile'],[]));
    compareComplexUnit(t,'9.8 m/s^2', new LiteralNumber(9.8).withUnit([['meter',1]],[['second',2]]));
    compareComplexUnit(t,'9.8 m/s^2 * 10 s', new LiteralNumber(98.0).withUnit([['meter']],[['second']]));
    compareComplexUnit(t,'10 s * 9.8 m/s^2', new LiteralNumber(98.0).withUnit('meter','second'));
    compareComplexUnit(t,'60 mile / 1 hour', new LiteralNumber(60).withUnit('mile','hour'));
    compareComplexUnit(t,'4000 mile * 1 hour', new LiteralNumber(4000).withUnit(['mile','hour']));
    compareComplexUnit(t,'4000 mile * 1 hour / 40 mile', new LiteralNumber(100).withUnit('hour'));
    compareComplexUnit(t,'4000 mile / (40 mi/hr)', new LiteralNumber(100).withUnit('hour'));
    compareComplexUnit(t,'600000 meter / (40 mi/hr)', new LiteralNumber(9.32).withUnit('hour'));
    compareComplexUnit(t,'1/10m/s',new LiteralNumber(0.1).withUnit('second','meter'));
    compareComplexUnit(t,'5m / 5m/s',new LiteralNumber(1).withUnit('second'));
    compareComplexUnit(t,'5km / 5m/s',new LiteralNumber(1000).withUnit('second'));
    const ER = 6371.008;
    compareComplexUnit(t,'earth.radius / 4000 meter/second', new LiteralNumber(ER*1000/4000).withUnit('second'));
    compareComplexUnit(t,'earth.radius / 4000 feet/second', new LiteralNumber(ER*1000/1219.2).withUnit('second'));
    compareComplexUnit(t,'earth.radius / 4000 feet/second as hour', new LiteralNumber((ER*1000/1219.2)/60/60).withUnit('hour'));
    compareComplexUnit(t,'4000mi / (4000 ft/second)',new LiteralNumber(5280).withUnit('second'));
    compareComplexUnit(t,'4000mi / (2727 mi/hr)',new LiteralNumber(1.46).withUnit('hour'));
    compareComplexUnit(t,'earth.radius / 4000 m/s as hours',new LiteralNumber(0.44).withUnit('hour'));


    //7. how long does it take light to get from the sun to the earth?
    //compareComplexUnit(t,'92_000_000 miles / lightspeed as minutes', new Literal(8).withUnit('minute'));
    //how long does it take to drive around the world at 60 mph
    compareComplexUnit(t,'earth.radius * 2 * pi / 60 km/hr as days', new LiteralNumber(ER*Math.PI*2/60/24).withUnit('day'));
    //How many earths could fit inside jupiter?
    var JR = 69911;
    compareComplexUnit(t,'jupiter.radius^3 * 4/3 * pi', new LiteralNumber(Math.pow(JR,3)*4/3*Math.PI).withUnits([['kilometer',3]]));
    compareComplexUnit(t,'4/3 * pi * jupiter.radius^3 ', new LiteralNumber(Math.pow(JR,3)*4/3*Math.PI).withUnits([['kilometer',3]]));
    compareComplexUnit(t,'(jupiter.radius^3 * 4/3 * pi) / (earth.radius^3 * 4/3 * pi)', new LiteralNumber(1321.33));
    compareComplexUnit(t,'earth.radius^3 * 4/3 * pi', new LiteralNumber(Math.pow(ER,3)*4/3*Math.PI).withUnits([['kilometer',3]]));
    t.end();
});

