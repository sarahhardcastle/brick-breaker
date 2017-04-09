window.onload = function() {
Crafty.init(400,600,document.getElementById('game'));
if (typeof Crafty.storage("highscore") === "undefined") {
	Crafty.storage("highscore", 0);
}
var assets = {
	"sprites": {
		"sprites.png": {
			"tile": 20,
			"tileh": 20,
			"map": {
				"brick1": [0,0,2,1],
				"brick2": [2,0,2,1],
				"brick3": [4,0,2,1],
				"brick4": [6,0,2,1],		
				"brick5": [8,0,2,1],
				"ball": [0,1],
				"qMark": [1,1]
			}
		}
	}
};

Crafty.scene("loading", function(){
	Crafty.load(assets, function() {
		Crafty.scene("start");
	});	
});


//playing game
Crafty.scene("inGame", function() {
	Crafty.background('#001');

	
	//bricks
	var bricks = [];
	function remove(i){
		console.log("removing "+i);
		for (j=0; j<bricks.length; j++){
			if (bricks[j].id == i) { bricks.splice(j,1);}
		}
	}
	for (var x1=1; x1<9; x1++) {
		for (var y1=4; y1<12; y1++){
			bricks.push(Crafty.e('2D, DOM, Collision, brick'+Crafty.math.randomInt(1,5))
				.attr({x: 40*x1, y: 20*y1, id: (y1-4)+((x1-1)*8)})
				.onHit('ball', function() {
					Crafty("Score").score += 1*Crafty('ball').combo;
					Crafty('ball').combo += 1;
					if (Math.abs(this.y-Crafty('ball').y) < 20){
						Crafty('ball').direction *= -1;
					}
					console.log(bricks.length);
					remove(this.id)
					this.destroy(); 
				})
			);
		}
	}	

	
	//paddle
	Crafty.e("Player, 2D, DOM, Color, Multiway")
		.attr({x:160, y:550, w:80, h:20})
		.color('#F00')
		.multiway(150, {LEFT_ARROW: 180, RIGHT_ARROW:0});

	//ball
	Crafty.e("2D, DOM, Collision, ball")
		.attr({x:195, y:530, w:20, h:20, combo: 0, speed: 5,
		direction: Crafty.math.randomInt(-3*Math.PI/4, -Math.PI/4)})
		.bind('EnterFrame', function(){
			//hit sides
			if (this.x < 0 || this.x > 390) {
				this.direction = Math.PI - this.direction;
			}
			//hit roof
			if (this.y < 0) {
				this.direction *= -1;
			}
			if (this.y > 535) {
				var score = Crafty("Score").score;
				if (score > Crafty.storage("highscore")){
					Crafty.storage("highscore", score);
				}
				Crafty.scene("endGame", score);
			}
		
			this.x += this.speed * Math.cos(this.direction);
			this.y += this.speed * Math.sin(this.direction);
		})
		.onHit('Player', function(){
			this.combo = 1;
			this.direction *= -1;
		});
	
	//Score	
 	Crafty.e("Score, 2D, DOM, Text")
		.attr({x:0, y:0, score: 0})
		.textColor('#EEE')
		.textFont({size:'24px', weight:'bold', family:'monospace'})
		.textAlign('left')
		.text(function() {return "Score: " + this.score;})
		.dynamicTextGeneration(true);
});

//game over, displays score
Crafty.scene("endGame", function(score) {
	Crafty.background('#001');
	//Game over message
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:200})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("Game Over");
	//Score information
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:250})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("Score: " + score);
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:300})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("High Score: " + Crafty.storage("highscore"));
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:350})
		.textColor('#EEE')
		.textFont({size:'20px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("PRESS SPACE TO START")
		.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.SPACE) {
				Crafty.scene("inGame");
			}
		});
	Crafty.e("2D, DOM, Mouse,qMark")
		.attr({w:40, h:40, x:5, y:5})
		.bind('Click', function(MouseEvent){
			Crafty.scene("about");
		});	
});

Crafty.scene("start", function(){
	Crafty.background('#001');
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:200})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("BRICK BREAKER");
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:250})
		.textColor('#EEE')
		.textFont({size:'20px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("SCORE\xa0 TO\xa0 BEAT :\xa0 " + Crafty.storage("highscore"));
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:280})
		.textColor('#EEE')
		.textFont({size:'20px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("PRESS\xa0 SPACE\xa0 TO\xa0 START")
		.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.SPACE) {
				Crafty.scene("inGame");
			}
		});
	Crafty.e("2D, DOM, Mouse,qMark")
		.attr({w:40, h:40, x:5, y:5})
		.bind('Click', function(MouseEvent){
			Crafty.scene("about");
		});
});

Crafty.scene("about", function(){
	Crafty.background('#001');
	Crafty.e("2D, DOM, Text, Mouse")
		.attr({w:400, h:500, x:0, y:50})
		.textColor('#EEE')
		.textFont({size:'20px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("- - - - - - - - - - BRICK BREAKER - - - - - - - - - \n - - -\xa0\xa0GAME BUILT USING CRAFTYJS\xa0\xa0- - -");  
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:450})
		.textColor('#EEE')
		.textFont({size:'20px', weight:'bold', family:'monospace'})
		.textAlign('center')
		.text("PRESS SPACE TO RETURN TO START SCREEN")
		.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.SPACE) {
				Crafty.scene("start");
			}
		});
});


Crafty.scene("loading");

};
