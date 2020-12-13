/**
 * Created by josh on 5/13/17.
 */

import test from "tape"
import {compareUnit} from "./common.js"

test("mass units", function(t) {
    compareUnit(t,"50g",50,'gram');
    compareUnit(t,"50kg", 50,'kilograms');
    compareUnit(t,'50lb', 50,'pounds');
    compareUnit(t,'50oz', 50,'ounces');
    compareUnit(t,'50lb as grams',22679.6,'grams');
    compareUnit(t,'50oz as grams',1417.475, 'grams');
    compareUnit(t,'50oz + 60oz',110, 'oz');
    compareUnit(t,'1oz + 1lb',17*1/16.0,'pounds');
    compareUnit(t,'(1oz + 1lb) as grams',481.942,'gram');
    compareUnit(t,'50g * 2',100,'grams');
    compareUnit(t,'50 * 2g',100,'grams');
    compareUnit(t,"5lbs + 4oz",84,"ounces");
    compareUnit(t,"(5lbs + 4g) as kilograms",2.26796,"kilograms");
    t.end();
});

