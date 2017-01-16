function Sprite(aMap, len){
    this.map       = aMap;
    this.direction = "N";    // One of E/S/W/N
    this.position  = [-1,0]; // Start Poting
    this.side      = len;    // side length of the map
    this.isTried   = false;  // Try turn right
    this.isEnd     = false;
    this.count     = 0;      // For tracking
    this.isPositionValid = function(x, y){  //Out of Boundary
        if( x > len - 1 || y > len - 1 ||
            x < 0       || y < 0) {
                return false;
        };
        if(this.map[y][x] > 0){ // Already tracked
            return false;
        }
        return true;
    };
    this.isFinished = function(){
        return this.isEnd;
    };
    this.nextPosition = function(){
        let [x,y] = this.position;
        switch(this.direction){
        case "N":
            x++; // From Left to Right
            break;
        case "E":
            y++; // From Top to Bottom
            break;
        case "S":
            x--; // From Right to Left
            break;
        case "W":
            y--; // From Bottom to Top
            break;
        }
        return [x,y];
    };
    this.turnRight = function(){
        switch(this.direction){
        case "N":
            this.direction = "E";
            break;
        case "E":
            this.direction = "S";
            break;
        case "S":
            this.direction = "W";
            break;
        case "W":
            this.direction = "N";
            break;
        }
    };
    this.isAlreadyTurned = function(){
        return this.isTried;
    };
    this.move = function(){
        let [x,y]= this.nextPosition();
        if (this.isPositionValid(x, y)){
            this.isTried = false;
            this.position = [x , y];
            this.map[y][x] = ++this.count;
//            console.log(this.map[y][x]);
        } else if(!this.isAlreadyTurned()){
            this.isTried = true;
            this.turnRight();
            this.move();
        } else {
            this.isEnd = true;
        }
    };
    this.drawMap = function(){
        for (let i=0; i<len; i++){
            let sPos = "";
            for (let j=0; j<len; j++){
                sPos = sPos + "   " + this.map[i][j];
            }
            console.log(sPos);
        };
    };
}

function main(len){
    // Initialize Map
    let aMap = [];
    for (let i=0; i<len; i++){
        aMap[i] = [];
        for (let j=0; j<len; j++){
            aMap[i][j] = 0;
        }
    };
    let dog = new Sprite(aMap, len);
    while(!dog.isFinished()){
        dog.move();
    }
    dog.drawMap();
}
