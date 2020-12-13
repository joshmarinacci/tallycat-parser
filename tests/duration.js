/**
 * Created by josh on 5/13/17.
 */
import test from "tape"
import {compareUnit} from "./common.js"

test("duration units", function(t) {
    compareUnit(t,'3hr',3,'hours');
    compareUnit(t,'30min',30,'minutes');
    compareUnit(t,'3.8hr as seconds',3.8*60*60,'seconds');
    compareUnit(t,'100000s as days',100000/(60*60*24),'days');
    compareUnit(t,'3hr + 30min as seconds',3.5*60*60,'seconds');
    compareUnit(t,'3hr + 30min as minutes',3*60+30,'minutes');
    //compareUnit(t,"date('august 31st, 1975')", moment([1975,8-1,31]),'date','date');
    //compareUnit(t,"date(year:1975)",moment('1975','YYYY'),'date','date');
    //compareUnit(t,"date('1975-08-31',format:'YYYY MM DD')",moment([1975,8-1,31]),'date','date');
    t.end();
});
