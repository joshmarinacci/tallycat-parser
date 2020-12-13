import test from "tape"
import {compareUnit} from "./common.js"

/**
 * Created by josh on 5/13/17.
 */

test("area units", function(t) {
    compareUnit(t,'8ft^2',8,'foot',2);
    compareUnit(t,'(8ft)^2',64,'foot',1);
    compareUnit(t,"1 square miles as acres",1*640,"acre");
    compareUnit(t,"200ft * 300ft as acres",1.3774105,"acre");
    compareUnit(t,"42 mi^2",42,'mile',2);
    compareUnit(t,'10 square miles',10,'mile',2);
    //compareUnit(t,'10 sq mi',10,'mile',2);
    compareUnit(t,'10 square meters',10,'meter',2);
    //compareUnit(t,'10 sq m',10,'meter',2);
    compareUnit(t,'9 sqft',9,'feet',2);
    compareUnit(t,'9ft * 9m',24.6888,'meter',2);
    compareUnit(t,'8m * 9ft',236.2204724,'foot',2);
    compareUnit(t,'3ft * 6ft',18,'foot',2);
    //compareUnit(t,'(3ft * 6ft) as sq mi',6.4566e-7,'miles',2);
    compareUnit(t,'1000ac',1000,'acres');
    //compareUnit(t,'1000ac as sq m',1000*4046.8564224,'meters',2);
    //compareUnit(t,'40 acres as sq mi',0.0625,'miles',2);
    //compareUnit(t,'25sqmi + 1000acres',68796559.1808,'meters',2);
    compareUnit(t,'10m^2',10,'meter',2);

    compareUnit(t,'8 acres',8,'acre');
    compareUnit(t,'1m * 2m as acre',0.000494211,'acre');
    compareUnit(t,'1km * 2km as acre',494.211,'acre');
    compareUnit(t,'1m * 2m as square feet',21.5278,'feet',2);
    //compareUnit(t,'1m * 2m as sq ft',21.5278,'feet',2);
    compareUnit(t,'1m * 2m as ft^2' ,21.5278,'feet',2);
    compareUnit(t,'1m * 2m as sqft' ,21.5278,'feet',2);
    compareUnit(t,'1m * 2m as square feet' ,21.5278,'feet',2);
    t.end();
});
