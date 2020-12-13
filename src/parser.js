import ohm from "ohm-js"
import {LiteralNumber} from "./literalnumber.js"
import {LiteralString} from "./literalstring.js"
import {UNITS} from "./units.js";
// var moment = require('moment');

import fs from "fs"
import path from "path"

class FunCall {
    constructor(fun, arg) {
        this.type = 'funcall';
        this.fun = fun;
        this.arg = arg;
    }
    toString() {
        return "Function Call"
    }
    invoke() {
        return this.fun(this.arg);
    }
}

var grammar;
var sem;
function GET(url) {
    return new Promise((res,rej)=>{
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load",function(){
            //console.log("got event",this.responseText);
            res(this.responseText);
        });
        xhr.open("GET",url);
        xhr.send();
    });
}

const SYMBOLS = {
    'pi': new LiteralNumber(Math.PI),
    'earth.radius':new LiteralNumber(6371.008).withUnits(['kilometer']),
    'jupiter.radius':new LiteralNumber(69911).withUnits(['km']),
    'five':new LiteralNumber(5).withUnits(['km']),
    'date': function(arg) {
        console.log("doing date on arg " + arg, arg.string);
        return moment(arg.string);
    },
    'year': function(arg) {
        if(arg.type === 'funcall') arg = arg.invoke();
        if(!moment.isMoment(arg)) throw new Error("not a valid date object");
        return new LiteralNumber(arg.year());
    },
    'weekday': function(arg) {
        if(arg.type === 'funcall') arg = arg.invoke();
        if(!moment.isMoment(arg)) throw new Error("not a valid date object");
        console.log('real weekday is', arg.day());
        return new LiteralNumber(arg.day());
    }
};
function resolveSymbol(name) {
    var ref = name.toLowerCase();
    if(!SYMBOLS[ref]) throw Error("Symbol not found " + name);
    return SYMBOLS[ref];
}

function generateSemantics(grammar) {
    var sem = grammar.createSemantics();
    sem.addOperation('calc', {
        Literal: (num, unit) => {
            var num_t = num.calc();
            var unit_t = unit.calc()[0];
            if(!unit_t) return num_t;
            //console.log("doing final literal",num_t, unit_t);
            return num_t.withUnits(unit_t[0],unit_t[1]);
        },
        unitchunk : function(a,b,c) {
            var name = a.calc().join("");
            var power = c.calc().join("");
            name = UNITS.getCanonicalName(name);
            if(power) return [name,parseInt(power)];
            return [name,1];
        },
        Unit: function(mod, numer, div, denom) {
            var numers = numer.calc();
            var denoms = denom.calc();
            if(denoms.length > 0) {
                numers = [numers];
                return [numers,denoms];
            }
            var n  = numer.calc()[0];
            var p = numer.calc()[1];
            var md = mod.calc();
            if(md.length == 1 && md[0] === 'square') p = 2;
            if(md.length == 1 && md[0] === 'cubic') p = 3;
            //console.log("Making unit with",n,p);
            return [[[n,p]],[]];
        },
        Number: (a) => a.calc(),
        integer: function(a,b) {
            var v = parseInt(a.calc().join("").replace(/_/g,''), 10);
            var exp = b.calc();
            if(exp && exp.length >= 1) v = v* Math.pow(10, exp[0].getValue());
            return new LiteralNumber(v);
        },
        float: function(a,b,c,e) {  return new LiteralNumber(parseFloat(this.sourceString));  },
        hex:  function(a,b) {       return new LiteralNumber(parseInt(this.sourceString))},//.withPreferredFormat('hex'); },
        percent: (a,b) => a.calc().multiply(new LiteralNumber(1/100)),
        exp: (_,sign,exp) => new LiteralNumber(parseFloat(exp.calc()[0])),
        AddExpr_plus: ((a,_,b) => a.calc().add(b.calc())),
        AddExpr_minus: ((a,_,b) => a.calc().subtract(b.calc())),
        MulExpr_multiply: ((a,_,b) => a.calc().multiply(b.calc())),
        MulExpr_divide: ((a,_,b) => a.calc().divide(b.calc())),
        ExpExpr_power: ((a,_,b) => a.calc().exponent(b.calc())),
        PriExpr_paren: ((p1,a,p2) => a.calc()),
        AsExpr: (a,_,u) => a.calc().as(new LiteralNumber(1).withUnits(u.calc()[0])),
        identifier:function(_a,_b) { return resolveSymbol(this.sourceString)},
        String_single:function(_a,str,_b) { return new LiteralString(str.calc().join(""))},
        String_double:function(_a,str,_b) { return new LiteralString(str.calc().join(""))},
        FunCall:(ident,_1,expr,_2) => new FunCall(ident.calc(),expr.calc()),
        _terminal: function() {
            return this.sourceString;
        }

    });
    sem.addOperation('tree',{
        FunCall:(ident,_1,expr,_2) => ['funcall',ident.tree(),expr.tree()],
        Literal:(num,unit)=> ['literal',num.calc(),unit.tree()],
        AddExpr_plus: (a,_,b) => ['add', a.tree(), b.tree()],
        AddExpr_minus: (a,_,b) => ['sub', a.tree(), b.tree()],
        MulExpr_multiply: (a,_,b) => ['mul', a.tree(), b.tree()],
        MulExpr_divide: (a,_,b) => ['div', a.tree(), b.tree()],
        ExpExpr_power: (a,_,b) => ['power', a.tree(), b.tree()],
        PriExpr_paren: (_1,a,_2) => ['paren', a.tree()],
        AsExpr: (a,_,u) => ['as',a.tree(),u.calc()],
        identifier:function(_a,_b) { return this.sourceString.toLowerCase()},
        _terminal: function() {
            return this.sourceString;
        }
    });

    sem.addOperation('html', {
        AddExpr_plus: (a,_,b) => a.html() + " + "+ b.html(),
        Literal:(num,unit)=> '<span>'+num.calc().getValue() + " " + unit.html()+'</span>',
        Unit: function(mod, numer, div, denom) {
            var u = this.calc();
            if(u.isCompound()) {
                var str = '';
                str += u.numers.map((n)=> n.name + '<sup>'+n.dimension+'</sup>').join(" ");
                str += '/';
                str += u.denoms.map((n)=> n.name + '<sup>'+n.dimension+'</sup>').join(" ");
                return str;
            }
            if(u.dimension > 1) {
                return u.name + '<sup>'+ u.dimension + '</sup>';
            }
            return u.name;
        }
    });
    return sem;
}
function init() {
    var source = "";
    if(typeof window !== 'undefined') {
        var file = require('./parser.ohm');
        GET(file).then((source)=>{
            grammar = ohm.grammar(source);
            sem = generateSemantics(grammar);
        });
    } else {
        source = fs.readFileSync(new URL('./parser.ohm', import.meta.url));
        grammar = ohm.grammar(source);
        sem = generateSemantics(grammar);
    }
}

export const Parser = {
    init: function() {
        init();
    },
    get: function() {
        if(!grammar) init();
        return grammar;
    },
    parseString: function(str) {
        var grammar = this.get();
        var m = grammar.match(str);
        if(m.failed()) throw new Error("match failed on: " + str);
        var val = sem(m);
        var js = val.calc();
        console.log("parsing",str, "->"+ js.toString());
        //var tree = val.tree();
        //console.log("tree is", JSON.stringify(tree,null,'  '));
        return js;
    },
    parseTree: function(str) {
        var grammar = this.get();
        var m = grammar.match(str);
        if(m.failed()) throw new Error("match failed on: " + str);
        var js = sem(m).tree();
        console.log("styling",str, "->"+js);
        return js;
    },
    parseStyledExpression: function(str) {
        var grammar = this.get();
        var m = grammar.match(str);
        var txt = sem(m).html();
        console.log('styling',str,'to',txt);
        return txt;
    }
}
