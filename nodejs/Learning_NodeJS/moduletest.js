function Animal(name){
    this.name = name;
    this.bark = function(){
        switch(this.name){
        case 'dog':
            console.log("Wo Wo");
            break;
        case 'cat':
            console.log("Mew Mew");
            break;
        default :
            console.log('Aho Aho');
        };
    };
}

// Factory pattern
// exports.generateAnimal = function(name){
//     return new Animal(name);
// };

//Constructor pattern
module.exports = Animal;
