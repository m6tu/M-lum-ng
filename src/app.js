    
import {HttpClient, json} from 'aurelia-fetch-client'


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

    
    currentNumOfTiles = 8
    currentKind = 1

    static log (...args) {
        console.log (args)
    }

    constructor() {
        this.initialize()
    }  

    initialize() {
        this.images = []

        for (let i = 0; i < 8; i++ ){
            this.images.push("src/images/emoji"+(i+1)+".jpg")
        }

        this.getScores()
 
       	console.log("initialize finished")
    }





    getScores() {
    	console.log(this.scoreList)
        this.httpClient.fetch('http://localhost:8080/scores')
        .then(response => response.json())
        .then(data => {
            this.scoreList = data
            console.log("data in scoreList")
            console.log(this.scoreList)

        })
    }


    startGame (numOfTiles, kind) {
     
        if (!numOfTiles) numOfTiles = this.currentNumOfTiles
        if (!kind) kind = this.currentKind

        this.currentKind = kind
        this.currentNumOfTiles = numOfTiles

        newBtn.textContent = "New Game"

        let prefix = ''
        switch (kind) {
            case 1: prefix = 'emoji'; break
            case 2: prefix = 'animal'; break
        }

        this.images = []
        for (let i = 0; i < 8; i++ ){
            this.images.push("src/images/"+prefix+(i+1)+".jpg")
        }

        this.tileList = []

        // Iga pilt lükatakse 2 korda ruutudele ning seejärel segatakse ruudud
        for (let i = 0; i < numOfTiles/2; i++) {
            this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
            this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
        }

        // TODO: remove lodash
        this.tileList = _.shuffle(this.tileList)

        this.gameStarted = Date.now()

        window.clearInterval(this.timer)
        this.elapsed = 0;
        this.timer = window.setInterval(() => {
            this.elapsed = Math.floor((Date.now() - this.gameStarted) / 1000)
        }, 1000)

        this.gameFinished = false
        this.scoreSaved = false
        this.gameRunning = true
    }  

    endGame () {
        App.log ('end')
        window.clearInterval(this.timer)
        this.gameRunning = false
        this.gameFinished = true
        this.score.score = this.elapsed
        this.score.mode = this.currentNumOfTiles
        this.score.type = this.currentKind
        newBtn.textContent = "Play Again?"
        
    
    }

    onTileClick(tileNum){
        App.log(tileNum)

        if (this.blocked) return
        if (this.openedTile===tileNum) return

        this.showTile(tileNum)

        if (this.openedTile===undefined) {
                App.log ('1st')
                this.openedTile = tileNum
        } else {
            if(this.tileList[tileNum].image===this.tileList[this.openedTile].image){
                App.log ('match')
                this.openedTile = undefined
                if (this.isGameOver())
                    this.endGame()
            } else {
                App.log ('2nd')
                this.blocked = true
                this.hideTiles(1, tileNum, this.openedTile)
                this.openedTile = undefined
            }
        }
    }

    isGameOver() {
        for (let i = 0; i < this.tileList.length; i++) {
            if (this.tileList[i].background=="src/images/background.jpg") return false
        }
        return true
    }

    showTile(tileNum){
        this.tileList[tileNum].background = this.tileList[tileNum].image
    }

    hideTiles(delay, tileNum1, tileNum2){
        App.log ('hide')
        window.setTimeout(() => {
            this.tileList[tileNum1].background="src/images/background.jpg"
            this.tileList[tileNum2].background="src/images/background.jpg"
            this.blocked = false
        }, delay * 500)
    }
    
    saveScore() {
        this.scoreSaved = true
        this.httpClient.fetch('http://localhost:8080/scores/add', {
            'method': "POST",
            'body': json(this.score)
        })
        .then(response => response.json())
        .then(data => {  
            this.getScores()
        })
    }

}

// https://gist.github.com/httpJunkie/431561420d62a746e02eef2d218d07d1
export class SortValueConverter {
    toView(array, property, direction) {
        if (!array)
            return array;
        let factor = direction.match(/^asc*/i) ? 1 : -1
        return array.sort((a, b) => {
            let textA = a.toUpperCase ? a[property].toUpperCase() : a[property]
            let textB = b.toUpperCase ? b[property].toUpperCase() : b[property]
          return (textA < textB) ? factor : (textA > textB) ? -factor : 0
        });
    }
}

