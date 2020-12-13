import test from "tape"
import {compareUnit} from "./common.js"

// var compareUnit = require('./common').compareUnit;

test("volume units", function(t) {
    compareUnit(t,'5gal',5,'gallons');
    compareUnit(t,'5cups',5,'cups');
    compareUnit(t,'5cups as gal',5/16,'gal');
    compareUnit(t,'5gal as cups',5*16,'cups');
    compareUnit(t,'3tbsp',3,'tablespoons');
    compareUnit(t,'3tsp',3,'teaspoons');
    compareUnit(t,'3l',3,'liters');
    compareUnit(t,'3ml',3,'milliliters');
    compareUnit(t,'3ml as liters',0.003,'liters');
    compareUnit(t,'3tsp as tablespoons',1.0,'tablespoons');
    compareUnit(t,'3tbsp as teaspoons',9,'teaspoons');
    //compareUnit(t,'21 cuft',22,'foot',3);
    compareUnit(t,'3 cm^3',3,'cm',3);
    compareUnit(t,'1000000 cm^3 as m^3',1,'m',3);
    compareUnit(t,' 1m^3 as cm^3',1000000,'cm',3);
    compareUnit(t,'3 cm^3 as ml',3,'milliliter');
    compareUnit(t,'3ft * 3ft * 3ft',27,'foot',3);
    compareUnit(t,'(3ft * 3ft * 3ft) as gallon',201.974,'gallon');
    compareUnit(t,'1ft^3',1,'foot',3);
    compareUnit(t,'4 qt',4,'quart');
    compareUnit(t,'4 pt',4,'pint');
    compareUnit(t,'4 qt as gallon',1,'gallon');
    compareUnit(t,'4 pt as gallon',0.5,'gallon');
    compareUnit(t,'4 l',4,'liter');
    compareUnit(t,'4ml',4,'ml');
    compareUnit(t,'1l as gal',0.264172,'gal');
    compareUnit(t,'4l + 3gal',3+1.05669,'gal');
    compareUnit(t,'1l + 15l as ml',16*1000,'ml');
    compareUnit(t,'(4l + 3gal) as ml',(4+3*3.78541)*1000,'milliliter');
    compareUnit(t,'48tsp as cups',1,'cup');
    compareUnit(t,'16tbsp as cups',1,'cup');
    compareUnit(t,'16cups as gal',1,'gal');
    compareUnit(t,'1tsp as gal',0.00130208,'gal');
    compareUnit(t,'1tsp as liter',0.00492892,'liter');
    compareUnit(t,'1tsp as ml',4.92892,'ml');
    compareUnit(t,'4ml as tsp',0.811537,'tsp');
    compareUnit(t,'4ml as tbsp',0.270512,'tbsp');
    compareUnit(t,'3 cups + 1 cups',4,'cups');
    compareUnit(t,'3 cups - 1 cups',2,'cups');
    //compareUnit(t,'1/2 cups',0.5,'cups');
    //compareUnit(t,'3 cups + (1/2cups)',3.5,'cups');
    compareUnit(t,'1ft * 2ft * 3ft', 6,'feet',3);
    compareUnit(t,'1ft * 2ft * 3ft as liter', 169.901,'liter');
    compareUnit(t,'1m * 2m * 3m as liter', 6000,'liter');
    compareUnit(t,'4ft * 5ft * 6ft as gallon',897.659,'gallon');
    //compareUnit(t,'4 cuft', 4,'feet',3);
    //compareUnit(t,'4 cu ft', 4,'feet',3);
    compareUnit(t,'4 cubic feet', 4,'feet',3);
    compareUnit(t,'4 ft^3', 4,'feet',3);
    //compareUnit(t,'4 cuft as gal', 29.9221,'gal',1);
    t.end();
});
