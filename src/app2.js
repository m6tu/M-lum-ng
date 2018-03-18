// Timer
function changeValue() {
  document.getElementById("demo").innerHTML = ++value;
}
var timerInterval = null;
function StartTimer() {
  stop(); // stoping the previous counting (if any)
  value = 0;
  clearInterval(timerInterval)
  timerInterval = setInterval(changeValue, 1000);  
}
var StopTimer = function() {
  clearInterval(timerInterval);
};
var ResetTimer = function() {
    clearInterval(timerInterval)
    document.getElementById("demo").innerHTML = 0;
};

//Tagastab meile mängija nime
//document.getElementById("name").value;


var resetButton = document.querySelector("#reset");
var openedTiles = [];
var messageDisplay = document.querySelector("#message");
// var modeButtons = document.querySelectorAll(".mode");
var images = [
	"images/emoji1.jpg",
	"images/emoji2.jpg",
	"images/emoji3.png",
	"images/emoji4.png",
	"images/emoji5.png",
	"images/emoji6.png",
	"images/emoji7.jpg",
	"images/emoji8.jpg"
];



function startGame() {
    //ResetTimer();
    resetButton.textContent = "New Game";
    messageDisplay.textContent = "";
    $('#gameboard').empty();
	var tiles = [];
	var openedImages = [];
    
    // Iga pilt lükatakse 2 korda ruutudele ning seejärel segatakse ruudud
	for (var i = 0; i < images.length; i++) {
		tiles.push(images[i]);
		tiles.push(images[i]);
	};
	tiles = _.shuffle(tiles);
    
	for (var i = 0; i < tiles.length; i++) {
		var tile = '<div class="card"></div>';
		$('#gameboard').append(tile);
	};
    
    $("#reset").click(function (event) {
        StartTimer();
    });    
    
	$("#gameboard .card").click(function (event) {
		if($(this).hasClass('opened')||openedImages.length >= 2){
            return;}
           
        
        var index = $(this).index();
        

		var image = tiles[index];
		$(this).css("background-image", 'url(' + image + ')');
        $(this).addClass ('opened');
        

		openedImages.push(index);
		if (openedImages.length === 2) {
			var index1 = openedImages[0];
			var index2 = openedImages[1];
			if (tiles[index1] === tiles[index2]) {
                    messageDisplay.textContent = "It's a pair"
					openedImages = [];
                    openedTiles.push("Hola!");
				}else {
                    messageDisplay.textContent = "Try again!"
					setTimeout(function () {
						var tile1 = $('#gameboard .card').eq(index1);
						var tile2 = $('#gameboard .card').eq(index2);

						tile1.css('background-image', '').removeClass('opened');
						tile2.css('background-image', '').removeClass('opened');
						openedImages = [];
					}, 600);
				}
			}
        
        //mänguvõidu check + uue alustamine        
        if(openedTiles.length === 2){
            StopTimer();
            messageDisplay.textContent = "Time: " + demo.innerHTML + " seconds!";
            //StartTimer();
            //ResetTimer();
            openedTiles = [];
            resetButton.textContent = "Play Again?"
        }else {
            console.log("next turn")
            };
        
        });
}



startGame();

//$('#start').click(startGame);
$('#reset').click(startGame);





// document.body.style.backgroundColor ="red";
// document.getElementById("gamboard").style.backgroundColor = "black";

// $("body").css("background-color", "blue");
// $("gameboard").css("background-color", "red");