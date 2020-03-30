function Hook(prototype, functionName) {
    this.proto = prototype;
    this.function = functionName;

    if (this.proto[this.function].constructor.name != "Function") {
        throw new Error(`${this.function} is not a function member of ${this.proto}`);
    }

    if (this.proto[this.function].__leech__) {
        // We already put a hook there, no need to patch function
        return;
    }

    const leechInfo = {
        original: this.proto[this.function],
        before: [],
        after: []
    };

    let obj = this.proto;
    let func = this.function;

    this.proto[this.function] = function() {

        for (var i in obj[func].__leech__.before) {
            obj[func].__leech__.before[i](this, arguments);
        }

        let retval = leechInfo.original.apply(this, arguments);
        
        for (var i in obj[func].__leech__.after) {
            let temp = obj[func].__leech__.after[i](this, arguments, retval);
            if (temp != undefined)
                retval = temp;
        }

        return retval;
    }

    this.proto[this.function].__leech__ = leechInfo;
}

Hook.prototype.before = function(func) {
    this.proto[this.function].__leech__.before.push(func);
    return this;
};

Hook.prototype.after = function(func) {
    this.proto[this.function].__leech__.after.push(func);
    return this;
};

module.exports = function(object, member) {
    if (object[member]) {
        return new Hook(object, member);
    }

    if (object.prototype[member]) {
        return new Hook(object.prototype, member);
    }

    if (object.constructor.prototype[member]) {
        return new Hook(object.constructor.prototype, member);
    }

    throw new Error(`Could not find ${member} on ${object}`);
};
