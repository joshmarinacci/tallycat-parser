/**
 * Created by josh on 5/13/17.
 */
var test = require('tape');
var compareUnit = require('./common').compareUnit;
test("length units", function(t) {
    compareUnit(t,'40m',40,'meter');
    compareUnit(t,'40km',40,'kilometer');
    compareUnit(t,"40m as feet",131.234,'foot');
    compareUnit(t,'40km as m',40*1000,'m');
    compareUnit(t,"42 square miles",42,'mile',2);
    //compareUnit(t,"42 sq mi",42,'mile',2);
    compareUnit(t,"50mm", 50,'millimeters',1);
    compareUnit(t,"50in", 50, 'inches');
    compareUnit(t,"50in * 5", 50*5,'inches');
    compareUnit(t,"50 * 5in", 50*5,'inches');
    compareUnit(t,"1km+500m", 1500,'meters');
    compareUnit(t,'3ft + 6ft as meters',2.7432,'meters');
    compareUnit(t,'(3ft + 6ft) as feet',9,'feet');
    compareUnit(t,'20000 leagues',20*1000,'league');
    compareUnit(t,'20000 leagues as km',20*1000*4,'kilometer');
    compareUnit(t,'3 mi',3,"mile");
    compareUnit(t,'3 miles',3,"mile");
    compareUnit(t,'3 mi as km',4.82803,'kilometers');
    compareUnit(t,'2ft/2',1,"feet");
    //compareUnit(t,'2/2ft',1,"feet");
    compareUnit(t,'2ft*2',4,"feet");
    compareUnit(t,'2*2ft',4,"feet");
    compareUnit(t,'1 + 2 + 3 + 4', 10, 'none');
    compareUnit(t,'1 + 2 * 3 + 4', 11,'none');
    compareUnit(t,'4ft - 5ft', -1,'feet');
    compareUnit(t,'4ft * 5ft', 20,'feet',2);
    compareUnit(t,'4ft / 2ft',  2,'none');
    compareUnit(t,'4 + 5 + 6', 15,'none');
    compareUnit(t,'4 + 5 * 6', 34,'none');
    compareUnit(t,'(4+5) * 6', 54,'none');
    compareUnit(t,'4 + (5*6)', 34,'none');
    compareUnit(t,'(1+2)*(3+4)', 21,'none');
    compareUnit(t,'1ft * 2ft * 3ft', 6,'feet',3);
    compareUnit(t,'4ft as meter',1.2192,'meter');
    compareUnit(t,'4ft as m',1.2192,'meter');
    compareUnit(t,'4ft as meters',1.2192,'meter');
    compareUnit(t,'4ft as inch',4*12,'inch');
    compareUnit(t,'4ft', 4,'ft');
    compareUnit(t,'4ft/2ft',2,'none');
    compareUnit(t,'4ft/2m',0.6096,'none');
    //compareUnit(t,'4ft/2gal',3,'none');//should error
    compareUnit(t,'(4+5)*6',(4+5)*6,'none');
    compareUnit(t,'4+5*6',4+(5*6),'none');
    compareUnit(t,'4+(5*6)',4+(5*6),'none');
    //compareUnit(t,'4ft - 2gal');//should error
    compareUnit(t,'4ft * 2sqft',8,'feet',3);
    compareUnit(t,'4m + 12ft as m',4 + 3.6576,'m');
    compareUnit(t,'4mm + 12ft as mm',4 + (3.6576/0.001),'mm');
    compareUnit(t,'40mm + 40cm + 4m',4.440,'m');
    t.end();
});
