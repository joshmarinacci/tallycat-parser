/**
 * Created by josh on 5/13/17.
 */
import test from "tape"
import tp from "tape-approximately"
tp(test)
import {Parser} from "../src/parser.js"
import {LiteralNumber} from "../src/literalnumber.js"


export function compareUnit(t, str, num, unit, dim) {
    let res = Parser.parseString(str);
    t.approximately(res.getValue(),num, 0.01);
    let ans = new LiteralNumber(num).withUnit(unit);
    if(unit === 'none') {

    } else {
        if(dim && dim !== 1) {
            ans = new LiteralNumber(num).withUnit([[unit,dim]]);
        }
        if(!res.equalUnits(ans)) {
            console.log("units not equal: ", str, res.toString());
            console.log(res.toString(),res);
            console.log(ans.toString(),ans);
        }
        t.equal(res.equalUnits(ans), true);
    }

}

function compareComplexUnit(t,str,ans) {
    let res = Parser.parseString(str);
    t.approximately(res.getValue(),ans.getValue(), 0.5);
    if(!res.equalUnits(ans)) {
        console.log("units not equal: ", str, res.toString());
        console.log(res.toString(),res);
        console.log(ans.toString(),ans);
    }
    t.equal(res.equalUnits(ans), true);
}

// module.exports = {
//     compareUnit: compareUnit,
//     compareComplexUnit: compareComplexUnit,
// };