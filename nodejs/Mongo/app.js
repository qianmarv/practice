const mongoose = require('mongoose');
mongoose.connect('mongodb://root:123456@localhost:27017/mongo_test');

const Cat = mongoose.model('Cat', {name: String});

const kitty = new Cat({name: 'Zildjian'});
kitty.save().then(()=>console.log('Meow'));
