var add = require('./add.js');
var expect = require('chai').expect;

describe('test add', function(){
    it('1 plus 1 should equal to 2', function(){
        expect(add(1,1)).to.be.equal(2);
    })
})