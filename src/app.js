    
import {HttpClient, json} from 'aurelia-fetch-client';


export class App {

    httpClient = new HttpClient()
    score = {}
    scoreList = []
    tileList = []
    openedTile = undefined
    gameStarted = undefined
    elapsed = 0
    blocked = false
    gameFinished = false
    scoreSaved = false
    gameRunning = false
    images = []
    
    

    constructor() {
        this.initialize()
    }  


    initialize() {
        this.images = []
        

        for (let i = 0; i < 8; i++ ){
            this.images.push("src/images/emoji"+(i+1)+".jpg");
        }

    }
    
    //
    changeMode(mode) {
        if (mode === 1){
            this.images = []
            for (let i = 0; i < 8; i++ ){
                this.images.push("src/images/emoji"+(i+1)+".jpg");
            }
            console.log("mode=emoji");
            } else if(mode === 2){
                this.images = []
                for (let i = 0; i < 8; i++ ){
                    this.images.push("src/images/animal"+(i+1)+".jpg");
                }
                console.log("mode=Animals");
                } else {
                    console.log("pole valikut!")
                    }
    }

    startGame(numOfTiles){
        newBtn.textContent = "New Game";
        //Muudab raskusastme valiku aktiivseks
        if (numOfTiles === 8){
            $( "button" ).removeClass( "selected" )
            $( "#easyBtn" ).addClass( "selected" )
            /*this.images = []
            for (let i = 0; i < 8; i++ ){
            
            this.images.push("src/images/animal"+(i+1)+".jpg");
        }*/
        } else {
            $( "button" ).removeClass( "selected" )
            $( "#hardBtn" ).addClass( "selected" )
        }
        
        /*if ($("#emojiBtn").hasClass("valitud")){
            console.log("emoji");
            for (let i = 0; i < 8; i++ ){
                this.images.push("src/images/emoji"+(i+1)+".jpg");
                }
        } else if($("#animalBtn").hasClass("valitud")) {
            console.log("animal");
            for (let i = 0; i < 8; i++ ){
                this.images.push("src/images/animal"+(i+1)+".jpg");
                }
        }*/
        
        this.tileList = [];    

        // Iga pilt lükatakse 2 korda ruutudele ning seejärel segatakse ruudud
        for (let i = 0; i < numOfTiles/2; i++) {
            this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"});
            this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"});

        };
        this.tileList = _.shuffle(this.tileList);
        
        this.gameStarted = Date.now();

        this.timer = window.setInterval(() => {
            this.elapsed = Math.floor((Date.now() - this.gameStarted) / 1000)
        }, 1000);

        this.gameFinished = false;
        this.scoreSaved = false;
        this.gameRunning = true;

    }  



    endGame () {
        console.log ('end');
        window.clearInterval(this.timer);
        this.gameRunning = false;
        this.gameFinished = true;
        this.score.score = this.elapsed;
        newBtn.textContent = "Play Again?";
    }

    onTileClick(tileNum){
        console.log(tileNum);

        if (this.blocked) return;
        if (this.openedTile===tileNum) return;

        this.showTile(tileNum);

        if (this.openedTile===undefined) {
                console.log ('1st');
                this.openedTile = tileNum;            
        } else {
            if(this.tileList[tileNum].image===this.tileList[this.openedTile].image){
                console.log ('match');
                this.openedTile = undefined;
                if (this.isGameOver())
                    this.endGame();
            } else {
                console.log ('2nd');
                this.blocked = true;
                this.hideTiles(1, tileNum, this.openedTile); 
                this.openedTile = undefined;
            }
        }
    }

    isGameOver() {
        for (let i = 0; i < this.tileList.length; i++) {
            if (this.tileList[i].background=="src/images/background.jpg") return false;
        }
        return true;
    }

    showTile(tileNum){
        this.tileList[tileNum].background = this.tileList[tileNum].image;
    }

    hideTiles(delay, tileNum1, tileNum2){
        console.log ('hide');
        window.setTimeout(() => {
            this.tileList[tileNum1].background="src/images/background.jpg"
            this.tileList[tileNum2].background="src/images/background.jpg"
            this.blocked = false;
        }, delay * 500);
        // this.tileList[tileNum].background="url('images/background.jpg')";

    }
    saveScore() {
        this.scoreSaved = true;
        this.httpClient.fetch('http://localhost:8080/scores/add', {
            'method': "POST",
            'body': json(this.score)
        })
        .then(response => response.json())
        .then(data => {  
            this.getScores();
        });
    }

    getScores() {
        this.httpClient.fetch('http://localhost:8080/scores')
        .then(response => response.json())
        .then(data => {
            this.scoreList = data;          
        });
    }

}

// https://gist.github.com/httpJunkie/431561420d62a746e02eef2d218d07d1
export class SortValueConverter {
  toView(array, property, direction) {
    if (!array)
      return array;
    let pname = property;
    let factor = direction.match(/^desc*/i) ? 1 : -1;
    var retvalue = array.sort((a, b) => {
      var textA = a.toUpperCase ? a[property].toUpperCase() : a[property];
      var textB = b.toUpperCase ? b[property].toUpperCase() : b[property];
      return (textA < textB) ? factor : (textA > textB) ? -factor : 0;
    });
    return retvalue;
  }
}

