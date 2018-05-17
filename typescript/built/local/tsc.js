var isDone = false;
if (isDone)
    console.log("Hello");
function sayHello(p) {
    console.log("Mr. " + p.lastName);
}
var Student = (function () {
    function Student(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        console.log("Initialized.");
    }
    return Student;
}());
var jack = new Student("San", "Zhang");
sayHello(jack);
//# sourceMappingURL=tsc.js.map