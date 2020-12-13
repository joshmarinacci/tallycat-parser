/**
 * Created by josh on 5/25/17.
 */

var abbrevations = {
    'in':'inch',
    'inches':'inch',
    'ft':'foot',
    'feet':'foot',
    'yards':'yard',
    'yd':'yard',
    'miles':'mile',
    'mi':'mile',
    'leagues':'league',

    's':'second',
    'seconds':'second',
    'min':'minute',
    'minutes':'minute',
    'hr':'hour',
    'hours':'hour',
    'days':'day',
    'months':'month',
    'years':'year',

    'm':'meter',
    'meters':'meter',
    'cm':'centimeter',

    'gal':'gallon',
    'gallons':'gallon',
    'qt':'quart',
    'pt':'pint',
    'cups':'cup',
    'tablespoons':'tablespoon',
    'tbsp':'tablespoon',
    'teaspoons':'teaspoon',
    'tsp':'teaspoon',
    'l':'liter',
    'liters':'liter',

    'grams':'gram',
    'g':'gram',
    'oz':'ounce',
    'ounces':'ounce',
    'pounds':'pound',
    'lbs':'pound',
    'lb':'pound',

    'acres':'acre',
    'ac':'acre',

};

var cvs = {
    units: {
        'sqft': {
            name:'foot',
            base:'foot',
            ratio:1,
            type:'area',
            dimension:2
        },
        'cuft': {
            name:'foot',
            base:'foot',
            ratio:1,
            type:'volume',
            dimension:3
        },
        'hex': {
            name:'hex',
            base:'hex',
            ratio:1,
            type:'format',
            dimension:0
        },
        'decimal': {
            name:'decimal',
            base:'decimal',
            ratio:1,
            type:'format',
            dimension:0
        }
    },
    //convert between unit bases
    bases: [
        {
            from:'gallon',
            ratio: 1/3.78541,
            to:'liter'
        },
        {
            from:'liter',
            ratio: 1/0.264172,
            to:'gallon'
        },
        {
            from:'meter',
            ratio:1/3.28084,
            to:'foot'
        },
        {
            from:'foot',
            ratio:3.28084,
            to:'meter'
        },
        {
            from:'pound',
            ratio:1/453.592,
            to:'gram'
        }
    ],
    //convert between unit types
    dims: [
        {
            from: {
                name:'foot',
                dim:3,
                type:'length'
            },
            ratio:0.133681,
            to: {
                name:'gallon',
                dim:1,
                type:'volume'
            }
        },
        {
            from: {
                name:'foot',
                dim:3,
                type:'length'
            },
            ratio:0.0353147,
            to: {
                name:'liter',
                dim:1,
                type:'volume'
            }
        },
        {
            from: {
                name:'meter',
                dim:3,
                type:'length'
            },
            ratio:1/1000,
            to: {
                name:'liter',
                dim:1,
                type:'volume'
            }
        },
        {
            from: {
                name:'meter',
                dim:2,
                type:'length'
            },
            ratio:4046.86,
            to: {
                name:'acre',
                dim:1,
                type:'area'
            }
        },
        {
            from: {
                name:'foot',
                dim:2,
                type:'length'
            },
            ratio:43560,
            to: {
                name:'acre',
                dim:1,
                type:'area'
            }
        }
    ]
};

function addUnit(name,base,ratio,type) {
    cvs.units[name] = {
        name:name,
        base:base,
        ratio:ratio,
        type:type,
        dimension:1,
        getUnit: function() {
            return this;
        },
        toString: function() {
            return this.name + "^"+this.dimension;
        }
    }
}
addUnit('none','none',1,'none');
addUnit('meter','meter',1,'length');
addUnit('foot','foot',1,'length');
addUnit('gram','gram',1,'mass');
addUnit('pound','pound',1,'mass');
addUnit('acre','acre',1,'area');
addUnit('gallon','gallon',1,'volume');
addUnit('liter','liter',1,'volume');
addUnit('second','second',1,'duration');
addUnit('byte','byte',1,'storage');
addUnit('bit','bit',1,'storage');

addUnit('inch','foot',12,'length');
addUnit('yard','foot',1/3,'length');
addUnit('mile','foot',1/5280,'length');
addUnit('ounce','pound',16,'mass');

function addDuration(name,ratio) {
    addUnit(name,'second',ratio,'duration');
}
addDuration('minute',1/(60));
addDuration('hour',1/(60*60));
addDuration('day',1/(60*60*24));
addDuration('month',1/(60*60*24*30));
addDuration('year',1/(60*60*24*365));

function addMeterLength(name,ratio) {
    addUnit(name,'meter',ratio,'length');
}
addMeterLength('centimeter',100);
addMeterLength('league',1/4000);

const metric_multiples = [['kilo','k'],['mega','M'],['giga','G'],['tera','T'],['peta','P'],['exa','E'],['zetta','Z'],['yotta','Y']];
function addMetricMultiples(arr,suffix,abr,type) {
    arr.forEach((prefix,i)=>{
        var name = prefix[0]+suffix;
        addUnit(name,suffix,1/Math.pow(1000,i+1),type);
        var abbr = prefix[1]+abr;
        abbrevations[abbr] = name;
        abbrevations[name+'s'] = name;
    });
}
addMetricMultiples(metric_multiples,'meter','m','length');
addMetricMultiples(metric_multiples,'gram','g','mass');
addMetricMultiples(metric_multiples,'liter','l','volume');
const metric_fractions = [['milli','m'],['micro','u'],['nano','n'],['pico','p'],['femto','f'],['atto','a'],['zepto','z'],['yocto','y']];
function addMetricFractions(arr,suffix,abr,type) {
    arr.forEach((prefix,i)=>{
        var name = prefix[0]+suffix;
        addUnit(name,suffix,Math.pow(1000,i+1),type);
        var abbr = prefix[1]+abr;
        abbrevations[abbr] = name;
        abbrevations[name+'s'] = name;
    });
}
addMetricFractions(metric_fractions,'meter','m','length');
addMetricFractions(metric_fractions,'gram','g','mass');
addMetricFractions(metric_fractions,'liter','l','volume');

function addGallonVolume(name,ratio) {
    addUnit(name,'gallon',ratio,'volume');
}
addGallonVolume('teaspoon',256*3);
addGallonVolume('tablespoon',256);
addGallonVolume('cup',16);
addGallonVolume('pint',8);
addGallonVolume('quart',4);

function addByte(name,ratio) {
    addUnit(name,'byte',ratio,'storage');
}

function addByteUnits(arr,suffix,abbrSuffix,power) {
    arr.forEach((prefix,i)=>{
        var name = prefix+suffix;
        addByte(name,1/Math.pow(power,i+1));
        var abbr = prefix[0].toUpperCase()+abbrSuffix;
        abbrevations[abbr] = name;
    });
}
var prefixes_1000 = ['kilo','mega','giga','tera','peta','exa','zetta','yotta'];
addByteUnits(prefixes_1000,'byte','B',1000);
addByteUnits(prefixes_1000,'bit','bit',1000);
var prefixes_1024 = ['kibi','mebi','gibi','tibi','pebi','exbi','zebi','yobi'];
addByteUnits(prefixes_1024,'byte','iB',1024);
addByteUnits(prefixes_1024,'bit','ibit',1024);


export const UNITS = {
    lookupUnit(name) {
        if (!cvs.units[name]) {
            console.log("WARNING. No unit for name", name);
            throw new Error();
        }
        return cvs.units[name];
    },
    findConversion(from,to) {
        return cvs.bases.find((cv) => cv.from == from && cv.to == to);
    },
    findDimConversion(from,to) {
        return cvs.dims.find((cv) => cv.from.name == from && cv.to.name == to);
    },
    getCanonicalName(name) {
        if(cvs.units[name]) return cvs.units[name].name;
        if(abbrevations[name]) return abbrevations[name];
        if(!name) return null;
        console.log("WARNING. no canonical name found for unit " + name);
        return null;
    },
};
