if (!String.prototype.includes) {
    String.prototype.includes = function (search: any, start) {
        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp')
        }
        if (start === undefined) { start = 0 }
        return this.indexOf(search, start) !== -1
    }
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search: any, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search
    }
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
    Object.assign = function (target: any, ...args: any[]) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 0; index < args.length; index++) {
            var nextSource = args[index];
            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}


// PadStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
        padString = padString || ' ';
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            return padString.repeat(Math.ceil(targetLength / padString.length)).slice(0, targetLength) + String(this);
        }
    };
}