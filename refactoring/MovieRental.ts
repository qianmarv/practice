abstract class Price{
    abstract getPriceCode() :number;
    abstract getCharge(days:number):number;
    abstract getRenterPoints(days:number): number;
}
class NewReleasePrice extends Price{
    public getPriceCode():number{
        return Movie.NEW_RELEASE;
    }

    public getCharge(days:number):number{
        return days * 3;
    }

    public getRenterPoints(days:number):number{
        return days > 1 ? 2 : 1;
    }
}

class RegularPrice extends Price{
    public getPriceCode():number{
        return Movie.REGULAR;
    }
    public getCharge(days:number):number{
        return days > 2 ? (2+(days-2)*1.5) : 2;
    }
    public getRenterPoints(days:number):number{
        return 1;
    }
}

class ChildrensPrice extends Price{
    public getPriceCode():number{
        return Movie.CHILDRENS
    }
    public getCharge(days: number):number{
        return days > 3 ? (1.5 + (days-3) * 1.5): 1.5
    }
    public getRenterPoints(days:number):number{
        return 1;
    }
}
export class Movie{
    // Seems that const is not supported inside class in ES6
    public static CHILDRENS   : number = 2;
    public static REGULAR     : number = 0;
    public static NEW_RELEASE : number = 1;

    private _title:     string;
    private _price: Price;

    public getFrequentRenterPoints(days:number): number{
        return this._price.getRenterPoints(days);
    }

    public constructor(title: string, priceCode: number){
        this._title     = title;
        this.setPriceCode(priceCode);
    }

    public getPriceCode(){
        return this._price.getPriceCode();
    }

    public setPriceCode(arg: number){
        switch(arg){
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
    }

    public getTitle(){
        return this._title;
    }
    public getCharge(days):number{
        return this._price.getCharge(days);
    };
}

export class Rental{
    private _movie: Movie;
    private _daysRented: number;

    public constructor(movie: Movie, daysRented: number){
        this._movie = movie;
        this._daysRented = daysRented;
    }

    public getDaysRented():number{
        return this._daysRented;
    }
    public getMovie():Movie{
        return this._movie;
    }
    public getCharge():number{
        return this.getMovie().getCharge(this.getDaysRented());
    }
    public getFrequentRenterPoints(){
        return this.getMovie().getFrequentRenterPoints(this.getDaysRented());
    }
}

export class Custom{
    private _name : string;
    private _rentals: Array<Rental> = [];

    public constructor(name: string){
        this._name = name;
    }

    public addRental(arg: Rental){
        this._rentals.push(arg);
    }

    public getName(){
        return this._name;
    }
    public getTotalCharge(){
        return this._rentals.reduce((totalAmount:number, rental:Rental)=>{
            return totalAmount + (rental.getCharge());
        },0)
    }
    public getTotalFrequentRentalPoints(){
        return this._rentals.reduce((totalPoints:number, rental:Rental)=>{
            return totalPoints + rental.getFrequentRenterPoints();
        },0)
    }

    public statement(){
        let rentals: Rental[] = this._rentals;
        let result: string = "Rental Record for " + this.getName() + "\n";

        result += rentals.reduce((str:string, each:Rental)=>{
            return str + "\t" + each.getMovie().getTitle() + "\t" + each.getCharge() + "\n";
        },'');
        result += "Amount owed is " + this.getTotalCharge() + "\n";
        result += "You earned " + this.getTotalFrequentRentalPoints() + " frequent renter points";
        return result;
    }

    public htmlStatement(){
        let rentals : Rental[] = this._rentals;
        let result  : String   = "<H1>Rentals for <EM>" + this.getName() + "</EM></H1><P>\n";
        result += rentals.reduce((str:string, each:Rental) => {
            return str += each.getMovie().getTitle() + ": " + each.getCharge() +"<BR>";
        },"");

        result += "<P>You owe <EM>" + this.getTotalCharge() + "</EM></P>";
        result += "On this rental you earned <EM>" + this.getTotalFrequentRentalPoints() + "</EM> frequent renter points<P>";
        return result;
    }
}
