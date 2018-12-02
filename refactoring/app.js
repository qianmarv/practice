"use strict";
exports.__esModule = true;
var MovieRental_1 = require("./MovieRental");
function main() {
    var jack = new MovieRental_1.Custom("Jack");
    var park = new MovieRental_1.Custom("Park");
    var aMovies = [
        new MovieRental_1.Movie("The Lord of the Ring I", MovieRental_1.Movie.NEW_RELEASE),
        new MovieRental_1.Movie("Perter Pan", MovieRental_1.Movie.CHILDRENS),
        new MovieRental_1.Movie("Transfomers I", MovieRental_1.Movie.REGULAR)
    ];
    jack.addRental(new MovieRental_1.Rental(aMovies[0], 3));
    jack.addRental(new MovieRental_1.Rental(aMovies[1], 5));
    jack.addRental(new MovieRental_1.Rental(aMovies[2], 8));
    console.log(jack.statement());
}
main();
