const leech = require("../src/leech");

function PrepareClass() {
    // Defining our classes
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }

    Person.prototype.say = function(message) {
        return `${this.name}: ${message}`;
    };

    Person.prototype.getAge = function() {
        return this.age;
    };

    return Person;
}

test("Puts a hook on parameters", () => {
    Person = PrepareClass();
    
    leech(Person, "say").before((obj, args) => {
        args[0] = "malicious!";
    });

    const p = new Person("John", 30);
    const msg = p.say("hello");

    expect(msg).toBe("John: malicious!");
});

test("Doesn't put a hook if no before or after are called", () => {
    Person = PrepareClass();

    leech(Person, "say");

    const p = new Person("John", 30);
    const msg = p.say("hello");

    expect(msg).toBe("John: hello");
});

test("Puts a hook on return value", () => {
    Person = PrepareClass();
    
    leech(Person, "getAge").after((obj, args, ret) => {
        return ret - 10;
    });

    const p = new Person("John", 30);
    const age = p.getAge();

    expect(age).toBe(20);
});

test("Doesn't modify return value if there is no need to", () => {
    Person = PrepareClass();
    
    leech(Person, "getAge").after((obj, args, ret) => {});

    const p = new Person("John", 30);
    const age = p.getAge();

    expect(age).toBe(30);
});
