export class App {
  constructor() {
    this.message = 'Hello World!';
  }




}


var images = [
	"../images/emoji1.jpg",
	"../images/emoji2.jpg",
	"../images/emoji3.png",
	"../images/emoji4.png",
	"../images/emoji5.png",
	"../images/emoji6.png",
	"../images/emoji7.jpg",
	"../images/emoji8.jpg"
];

function startGame() {
    $('#gameboard').empty();
	var tiles = [];
	var openedImages = [];

	for (var i = 0; i < images.length; i++) {
		tiles.push(images[i]);
		tiles.push(images[i]);
	};
	tiles = _.shuffle(tiles);

	for (var i = 0; i < tiles.length; i++) {
		var tile = '<div class="card"></div>';
		$('#gameboard').append(tile);
	};

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
					openedImages = [];
				}else {
					setTimeout(function () {
						var tile1 = $('#gameboard .card').eq(index1);
						var tile2 = $('#gameboard .card').eq(index2);

						tile1.css('background-image', '').removeClass('opened');
						tile2.css('background-image', '').removeClass('opened');
						openedImages = [];
					}, 500);
				}
			}
	});
}

startGame();

$('#start').click(startGame);






// document.body.style.backgroundColor ="red";
// document.getElementById("gamboard").style.backgroundColor = "black";

// $("body").css("background-color", "blue");
// $("gameboard").css("background-color", "red");

  
