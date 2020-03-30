const on = require("./leech");

function Person(name) {
    this.name = name;
}

Person.prototype.say = function(speech) {
    console.log(this.name + ": " + speech);
};

Person.prototype.getAge = function() {
    return 34;
};

on(Person, "say")
    .before((obj, args) => {
        args[0] = "Malicious speech!"
    });

on(Person, "getAge")
    .after((obj, args, ret) => {
        return ret - 7;
    });

const p = new Person("John Doe");
p.say("Hello");
console.log("Age: " + p.getAge());
