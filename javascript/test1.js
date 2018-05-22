var createConstructor = function(name){
    return (new function MyCons(){
        this.surName = name;
        this.sayHello = function(){
            console.log("Hello "+ name);
        };
    }(name));
};

var oJack = createConstructor("Jack");
oJack.sayHello();
