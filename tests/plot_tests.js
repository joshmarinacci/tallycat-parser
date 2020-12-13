/**
 * Created by josh on 5/12/17.
 */

var Parser = require('../src/parser.js');
var eq = Parser.parseTree("sin(theta)");
console.log("plot = ", eq);

const SYMBOLS = {
    sin: (args) => {
        return Math.sin(args.x);
    }
};

function evalAt(plot,params) {
    //console.log("evaluating",plot,'at',params);
    var type = plot[0];
    if(type === 'funcall') {
        var name = plot[1];
        //console.log('evaluating',name);
        var fun = SYMBOLS[name];
        console.log(fun(params));
    }
}
for(let x = 0; x<Math.PI*2; x+=0.1) {
    evalAt(eq, {x:x});
}
