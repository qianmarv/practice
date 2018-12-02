"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Price = /** @class */ (function () {
    function Price() {
    }
    return Price;
}());
var NewReleasePrice = /** @class */ (function (_super) {
    __extends(NewReleasePrice, _super);
    function NewReleasePrice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewReleasePrice.prototype.getPriceCode = function () {
        return Movie.NEW_RELEASE;
    };
    NewReleasePrice.prototype.getCharge = function (days) {
        return days * 3;
    };
    NewReleasePrice.prototype.getRenterPoints = function (days) {
        return days > 1 ? 2 : 1;
    };
    return NewReleasePrice;
}(Price));
var RegularPrice = /** @class */ (function (_super) {
    __extends(RegularPrice, _super);
    function RegularPrice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RegularPrice.prototype.getPriceCode = function () {
        return Movie.REGULAR;
    };
    RegularPrice.prototype.getCharge = function (days) {
        return days > 2 ? (2 + (days - 2) * 1.5) : 2;
    };
    RegularPrice.prototype.getRenterPoints = function (days) {
        return 1;
    };
    return RegularPrice;
}(Price));
var ChildrensPrice = /** @class */ (function (_super) {
    __extends(ChildrensPrice, _super);
    function ChildrensPrice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChildrensPrice.prototype.getPriceCode = function () {
        return Movie.CHILDRENS;
    };
    ChildrensPrice.prototype.getCharge = function (days) {
        return days > 3 ? (1.5 + (days - 3) * 1.5) : 1.5;
    };
    ChildrensPrice.prototype.getRenterPoints = function (days) {
        return 1;
    };
    return ChildrensPrice;
}(Price));
var Movie = /** @class */ (function () {
    function Movie(title, priceCode) {
        this._title = title;
        this.setPriceCode(priceCode);
    }
    Movie.prototype.getFrequentRenterPoints = function (days) {
        return this._price.getRenterPoints(days);
    };
    Movie.prototype.getPriceCode = function () {
        return this._price.getPriceCode();
    };
    Movie.prototype.setPriceCode = function (arg) {
        switch (arg) {
            case Movie.REGULAR:
                this._price = new RegularPrice();
                break;
            case Movie.CHILDRENS:
                this._price = new ChildrensPrice();
                break;
            case Movie.NEW_RELEASE:
                this._price = new NewReleasePrice();
                break;
            default:
                throw "Incorrect Price Code";
        }
    };
    Movie.prototype.getTitle = function () {
        return this._title;
    };
    Movie.prototype.getCharge = function (days) {
        return this._price.getCharge(days);
    };
    ;
    // Seems that const is not supported inside class in ES6
    Movie.CHILDRENS = 2;
    Movie.REGULAR = 0;
    Movie.NEW_RELEASE = 1;
    return Movie;
}());
exports.Movie = Movie;
var Rental = /** @class */ (function () {
    function Rental(movie, daysRented) {
        this._movie = movie;
        this._daysRented = daysRented;
    }
    Rental.prototype.getDaysRented = function () {
        return this._daysRented;
    };
    Rental.prototype.getMovie = function () {
        return this._movie;
    };
    Rental.prototype.getCharge = function () {
        return this.getMovie().getCharge(this.getDaysRented());
    };
    Rental.prototype.getFrequentRenterPoints = function () {
        return this.getMovie().getFrequentRenterPoints(this.getDaysRented());
    };
    return Rental;
}());
exports.Rental = Rental;
var Custom = /** @class */ (function () {
    function Custom(name) {
        this._rentals = [];
        this._name = name;
    }
    Custom.prototype.addRental = function (arg) {
        this._rentals.push(arg);
    };
    Custom.prototype.getName = function () {
        return this._name;
    };
    Custom.prototype.getTotalCharge = function () {
        return this._rentals.reduce(function (totalAmount, rental) {
            return totalAmount + (rental.getCharge());
        }, 0);
    };
    Custom.prototype.getTotalFrequentRentalPoints = function () {
        return this._rentals.reduce(function (totalPoints, rental) {
            return totalPoints + rental.getFrequentRenterPoints();
        }, 0);
    };
    Custom.prototype.statement = function () {
        var rentals = this._rentals;
        var result = "Rental Record for " + this.getName() + "\n";
        result += rentals.reduce(function (str, each) {
            return str + "\t" + each.getMovie().getTitle() + "\t" + each.getCharge() + "\n";
        }, '');
        result += "Amount owed is " + this.getTotalCharge() + "\n";
        result += "You earned " + this.getTotalFrequentRentalPoints() + " frequent renter points";
        return result;
    };
    Custom.prototype.htmlStatement = function () {
        var rentals = this._rentals;
        var result = "<H1>Rentals for <EM>" + this.getName() + "</EM></H1><P>\n";
        result += rentals.reduce(function (str, each) {
            return str += each.getMovie().getTitle() + ": " + each.getCharge() + "<BR>";
        }, "");
        result += "<P>You owe <EM>" + this.getTotalCharge() + "</EM></P>";
        result += "On this rental you earned <EM>" + this.getTotalFrequentRentalPoints() + "</EM> frequent renter points<P>";
        return result;
    };
    return Custom;
}());
exports.Custom = Custom;
