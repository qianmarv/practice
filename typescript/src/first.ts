let isDone: boolean = false;
if (isDone)
    console.log("Hello")

interface People{
    firstName: string;
    lastName: string;
}


function sayHello(p: People){
    console.log("Mr. " + p.lastName);
}

class Student implements People{
    public firstName: string;
    public lastName: string;
    public constructor(firstName: string, lastName: string){
        this.firstName = firstName;
        this.lastName  = lastName;
        console.log("Initialized.");
    }
}

let jack = new Student( "San", "Zhang");
sayHello(jack);
