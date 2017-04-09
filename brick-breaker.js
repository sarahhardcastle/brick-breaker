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
				"brick2": [1,0,2,1],
				"brick3": [2,0,2,1],
				"brick4": [3,0,2,1],		
				"brick5": [3,0,2,1],
				"ball": [0,1]
			}
		}
	}
};

Crafty.scene("loading", function(){
	Crafty.load(assets, function() {
		Crafty.scene("inGame");
	});	
});


//playing game
Crafty.scene("inGame", function() {
	Crafty.background('#001');
	
	//paddle
	Crafty.e("Player, 2D, DOM, Color, Multiway")
		.attr({x:160, y:550, w:80, h:20})
		.color('#F00')
		.multiway(150, {LEFT_ARROW: 180, RIGHT_ARROW:0});

	//ball
	Crafty.e("2D, DOM, Collision, ball")
		.attr({x:195, y:530, w:20, h:20, combo: 0,
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
		
			this.x += 3 * Math.cos(this.direction);
			this.y += 3 * Math.sin(this.direction);
		})
		.onHit('Player', function(){
			Crafty("Score").score += 1;
			this.direction *= -1;
		});

	//Score	
 	Crafty.e("Score, 2D, DOM, Text")
		.attr({x:0, y:0, score: 0})
		.textColor('#EEE')
		.textFont({size:'24px', weight:'bold'})
		.textAlign('left')
		.text(function() {return "Score: " + this.score;})
		.dynamicTextGeneration(true)
});

//game over, displays score
Crafty.scene("endGame", function(score) {
	Crafty.background('#001');
	//Game over message
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:200})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold'})
		.textAlign('center')
		.text("Game Over");
	//Score information
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:250})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold'})
		.textAlign('center')
		.text("Score: " + score);
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:300})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold'})
		.textAlign('center')
		.text("High Score: " + Crafty.storage("highscore"));
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:350})
		.textColor('#EEE')
		.textFont({size:'20px', weight:'bold'})
		.textAlign('center')
		.text("PRESS SPACE TO START")
		.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.SPACE) {
				Crafty.scene("inGame");
			}
		});
	
});

Crafty.scene("loading");

};
