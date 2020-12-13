/**
 * Created by josh on 5/26/17.
 */
import {UNITS} from "./units.js"

function crossFind(ar1, ar2, cb) {
    for(let i=0; i<ar1.length; i++) {
        var e1 = ar1[i];
        for(let j=0; j<ar2.length; j++) {
            var e2 = ar2[j];
            if(cb(e1,e2)) {
                return [e1,e2];
            }
        }
    }
}


export class LiteralNumber {
    constructor(value, numers, denoms) {
        this._value = value;
        this._numers = (numers?numers:[]);
        this._denoms = (denoms?denoms:[]);
    }
    withUnit(numers,denoms) {
        return this.withUnits(numers,denoms);
    }
    withUnits(numers, denoms) {
        if(typeof numers === 'string')  numers = [[numers,1]];
        if(typeof denoms === 'string')  denoms = [[denoms,1]];
        if(!numers) numers = [];
        if(!denoms) denoms = [];
        function toUnitPart(f) {
            if(typeof f[1] === 'number') return new UnitPart(f[0],f[1]);
            if(f instanceof UnitPart) return f;
            return new UnitPart(f,1)
        }
        return new LiteralNumber(this._value,
            numers.map(toUnitPart),
            denoms.map(toUnitPart));
    }
    clone() {
        return new LiteralNumber(this.getValue(),
            this._numers.map(u=>u.clone()),
            this._denoms.map(u=>u.clone()));
    }

    add(to) {
        if (this.equalUnits(to)) return new LiteralNumber(this.getValue() + to.getValue()).withUnits(this._numers,this._denoms);
        var u2 = this.as(to);
        if(u2.equalUnits(this)) throw new Error("bad add");
        return u2.add(to);
    }
    subtract(to) {
        return this.add(to.negate());
    }

    multiply(b) {
        var a = this;
        var found = crossFind(a._numers, b._numers, (x,y)=>x.getType() == 'length' && y.getType() == 'length');
        if(found) a = this.convertType(a,found[0],found[1]);
        var nu = new LiteralNumber(a.getValue() * b.getValue(),
            a._numers.concat(b._numers),
            a._denoms.concat(b._denoms)
        );
        return nu.expand().reduce().collapse();
    }

    exponent(b) {
        var exp = b.getValue();
        return new LiteralNumber(Math.pow(this.getValue(), exp),
            this._numers.map(u=>u.withDimension(u.getDimension()*exp)),
            this._denoms.map(u=>u.withDimension(u.getDimension()*exp)));
    }

    toString() {
        let n = this._numers.map((u)=>u.getFactor()+'*'+u.getName() + '^' + u.getDimension()).join();
        let d = this._denoms.map((u)=>u.getFactor()+'*'+u.getName() + '^' + u.getDimension()).join();
        return `Literal ${this._value} ${n} / ${d}`;
    }

    getValue() {
        return this._value;
    }

    divide(b) {
        return this.multiply(b.invert())
    }

    negate() {
        return new LiteralNumber(-this.getValue(), this._numers.map(u=>u.clone()), this._denoms.map(u=>u.clone()));
    }

    invert() {
        return new LiteralNumber(1/this.getValue(), this._denoms.map(u=>u.clone()), this._numers.map(u=>u.clone()));
    }

    as(to) {
        if (this.equalUnits(to)) return this;
        return this.convert(to);
    }

    equalUnits(b) {
        var a = this.collapse();
        b = b.collapse();
        if(a._numers.length !== b._numers.length) return false;
        if(a._denoms.length !== b._denoms.length) return false;
        for(let i=0; i<a._numers.length; i++) {
            if(a._numers[i].getName() !== b._numers[i].getName()) return false;
        }
        return true;
    }

    expand() {
        var found = crossFind(this._numers, this._denoms, (x,y)=>x.getType() === y.getType());
        if(found) return this.convertType(this,found[0],found[1]);
        return this;
    }

    convertType(a, first, second) {
        if(first.getName() === second.getName()) return a;
        if(first.getBase() === second.getBase()) {
            a = a.clone();
            a._numers.push(new UnitPart(second.getName(), second.getDimension(), Math.pow(second.getRatio(), second.getDimension())));
            a._denoms.push(new UnitPart(first.getName(), first.getDimension(), Math.pow(first.getRatio(), first.getDimension())));
            return a;
        }

        var cvv = UNITS.findConversion(first.getBase(), second.getBase());
        a = a.clone();
        //convert first to it's base
        a._numers.push(new UnitPart(first.getBase(),first.getDimension(),1));
        a._denoms.push(new UnitPart(first.getName(),first.getDimension(),Math.pow(first.getRatio(),first.getDimension())));
        //convert base to other base
        a._numers.push(new UnitPart(cvv.to,second.getDimension(),Math.pow(1,second.getDimension())));
        a._denoms.push(new UnitPart(cvv.from,first.getDimension(),Math.pow(cvv.ratio,first.getDimension())));
        //convert other base to second
        a._numers.push(new UnitPart(second.getName(),second.getDimension(),Math.pow(second.getRatio(),second.getDimension())));
        a._denoms.push(new UnitPart(second.getBase(),second.getDimension(),1));
        return a;
    }


    convert(b) {
        var a = this;
        function findTypeConversion(a, b, fromType, dim, toType) {
            if(a._numers.find((u)=>u.getDimension() === dim && u.getType() === fromType)) {
                if(b._numers.find((u)=>u.getType() === toType)) {
                    return a.dimConvert(b,fromType, dim, toType).reduce();
                }
            }
            return a;
        }
        a = findTypeConversion(a, b, 'length', 3, 'volume');
        a = findTypeConversion(a, b, 'length', 2, 'area');

        var match = crossFind(a._numers, b._numers,(a,b)=> a.getType() === b.getType());
        if(match) return a.convertType(a,match[0],match[1]).reduce();
    }

    dimConvert(to, fromType, dim, toType) {
        var first = this._numers.find((u) => u.getDimension() === dim && u.getType() === fromType);
        var second = to._numers.find((u) => u.getType() === toType);
        var conv = UNITS.findDimConversion(first.getBase(), second.getBase());
        let a = this.clone();
        //convert from u1 to the base
        a._numers.push(new UnitPart(first.getBase(),first.getDimension(),1));
        a._denoms.push(new UnitPart(first.getName(),first.getDimension(),Math.pow(first.getRatio(),first.getDimension())));
        //convert between bases
        a._numers.push(new UnitPart(conv.to.name, conv.to.dim, Math.pow(1,conv.to.dim)));
        a._denoms.push(new UnitPart(conv.from.name, conv.from.dim,conv.ratio));
        //convert from the second base to u2
        a._numers.push(new UnitPart(second.getName(),second.getDimension(),Math.pow(second.getRatio(),second.getDimension())));
        a._denoms.push(new UnitPart(second.getBase(),second.getDimension(),1));
        return a;
    }

    reduce() {
        var u2 = this.clone();
        var v2 = this._value;
        var n1 = u2._numers;
        var d1 = u2._denoms;
        //subtract dimension of any unit that is on top and bottom
        n1.forEach((n) => {
            d1.forEach((d) => {
                if(n.getName() == d.getName()) {
                    var sum = Math.min(n._dim, d._dim);
                    n._dim-= sum;
                    d._dim-= sum;
                }
            });
        });
        //pull out the factors to the value
        n1.forEach((u)=>{
            v2 *= u.getFactor();
            u._factor = 1;
        });
        d1.forEach((u)=>{
            v2 /= u.getFactor();
            u._factor = 1;
        });
        //remove any units that were reduced to zero
        let hasDimension = u=>u._dim>0;
        return new LiteralNumber(v2,
            n1.filter(hasDimension),
            d1.filter(hasDimension));
    }

    collapse() {
        let notNoneType = (a=>a.type!=='none');
        function groupSameName(a,b) {
            if(a.length == 0) return a.concat([b]);
            var last = a.pop();
            if(last.getName() == b.getName()) {
                a.push(last.withDimension(last.getDimension()+ b.getDimension()));
                return a;
            } else {
                a.push(last);
                a.push(b);
                return a;
            }
        }
        return new LiteralNumber(this._value,
            this._numers.filter(notNoneType).reduce(groupSameName,[]),
            this._denoms.filter(notNoneType).reduce(groupSameName,[]));
    }

}

class UnitPart {
    constructor(name, dim, factor) {
        this._name = UNITS.getCanonicalName(name);
        this._dim = (dim ? dim : 1);
        this._factor = (factor ? factor : 1);
    }
    clone() {
        return new UnitPart(this.getName(), this.getDimension(), this.getFactor());
    }
    getName() {
        return this._name;
    }
    getDimension() {
        return this._dim;
    }
    getType() {
        return UNITS.lookupUnit(this._name).type;
    }
    getBase() {
        return UNITS.lookupUnit(this._name).base;
    }
    getRatio() {
        return UNITS.lookupUnit(this._name).ratio;
    }
    getFactor() {
        return this._factor;
    }
    withDimension(dim) {
        return new UnitPart(this.getName(), dim, this.getFactor())
    }
}


// module.exports = {
//     LiteralNumber: LiteralNumber,
//     UnitPart: UnitPart
// }