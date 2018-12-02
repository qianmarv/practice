import {Custom, Rental, Movie} from "./MovieRental";

function main(){
    let jack:Custom = new Custom("Jack");
    let park:Custom = new Custom("Park");

    let aMovies: Movie[] = [
        new Movie("The Lord of the Ring I", Movie.NEW_RELEASE),
        new Movie("Perter Pan", Movie.CHILDRENS),
        new Movie("Transfomers I", Movie.REGULAR)
    ];

    jack.addRental(new Rental(aMovies[0], 3));
    jack.addRental(new Rental(aMovies[1], 5));
    jack.addRental(new Rental(aMovies[2], 8));

    console.log(jack.statement());
}

main();
