import {Parser} from "./src/parser.js";

let result = Parser.parseString('4ft * 6');
console.log(result.toString())
console.log(result.getValue())
result._numers.forEach(n => {
    console.log(n.getName(),n.getDimension(),n.getFactor())
})
result._denoms.forEach(n => {
    console.log(n.getName(),n.getDimension(),n.getFactor())
})
