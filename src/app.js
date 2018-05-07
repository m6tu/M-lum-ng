    
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
            case 3: prefix = 'country'; break
            case 4: prefix = 'translate'; break
            case 5: prefix = 'match'; break
            case 6: prefix = 'tolge'; break
            case 7: prefix = 'pic'; break
        }

        this.images = []
        
        if(kind === 1 || kind === 2){
            document.getElementById("gameboard").style.maxHeight = "424px";
            document.getElementById("gameboard").style.maxWidth = "424px";
            //Emoji + animals mode
            for (let i = 0; i < 8; i++ ){
                this.images.push("src/images/"+prefix+(i+1)+".jpg")
                }
            } else if(kind === 3 || kind === 4) {
                document.getElementById("gameboard").style.maxHeight = "424px";
                document.getElementById("gameboard").style.maxWidth = "424px";
                //Erinevate piltide mode
                for (let i = 0; i < numOfTiles/2; i++ ){
                    this.images.push("src/images/"+prefix+(i+1)+".jpg")
                    }
                if (prefix==='country'){
                    prefix ='match'
                } else if (prefix==='translate'){
                    prefix = 'tolge'
                    }   
                for (let i = 0; i < numOfTiles/2; i++ ){
                    this.images.push("src/images/"+prefix+(i+1)+".jpg")
                    }
                } else if(kind === 7){
                    for (let i = 0; i < numOfTiles*3; i++ ){
                        this.images.push("src/images/Mix/"+prefix+(i+1)+".jpg")
                        }
                    document.getElementById("gameboard").style.maxHeight = "848px";
                    document.getElementById("gameboard").style.maxWidth = "656.7px";
                }

        this.tileList = []

        // Iga pilt lükatakse 2 korda ruutudele ning seejärel segatakse ruudud
        if(kind === 1 || kind === 2){
            for (let i = 0; i < numOfTiles/2; i++) {
                this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
                this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
                }
            } else if(kind === 7){
                for (let i = 0; i < numOfTiles*1.1; i++) {
                this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
                this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
                }
            } else {
                //Countries tüübi puhul lükatakse iga pilt 1 kord ruutudele
                for (let i = 0; i < numOfTiles; i++) {
                    this.tileList.push({image: this.images[i], class:"", background:"src/images/background.jpg"})
                    }
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
        console.log(this.elapsed)        
    
    }

    //CEALN CODE KIRJUTADA !!
    onTileClick(tileNum){
        App.log(tileNum)
        if (this.blocked) return
        if (this.openedTile===tileNum) return
        this.showTile(tileNum)

        //Emoji ja animal mode matchimine
        if(this.currentKind === 1 || this.currentKind === 2 || this.currentKind === 7){
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
            } else {
                if (this.openedTile===undefined) {
                    App.log ('1st')
                    this.openedTile = tileNum
            } else if(this.currentKind === 3) {
                //Countries mode matchimine
                let stringLength = this.tileList[tileNum].image.length
                let picNum = this.tileList[tileNum].image.charAt(stringLength - 5)
                
                if(this.tileList[tileNum].image==="src/images/country" + picNum + ".jpg" || this.tileList[tileNum].image==="src/images/match" + picNum + ".jpg"){
                    if(this.tileList[this.openedTile].image === "src/images/match" + picNum + ".jpg" || this.tileList[this.openedTile].image === "src/images/country" + picNum + ".jpg"){
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
                    } else {
                        App.log ('2nd')
                        this.blocked = true
                        this.hideTiles(1, tileNum, this.openedTile)
                        this.openedTile = undefined
                        }
                
                } else if(this.currentKind === 4) {
                    //Language mode matchimine
                    let stringLength = this.tileList[tileNum].image.length
                    let picNum = this.tileList[tileNum].image.charAt(stringLength - 5)
                    
                    if(this.tileList[tileNum].image==="src/images/translate" + picNum + ".jpg" || this.tileList[tileNum].image==="src/images/tolge" + picNum + ".jpg"){
                        if(this.tileList[this.openedTile].image === "src/images/tolge" + picNum + ".jpg" || this.tileList[this.openedTile].image === "src/images/translate" + picNum + ".jpg"){
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
