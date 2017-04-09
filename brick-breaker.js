window.onload = function() {
Crafty.init(400,600,document.getElementById('game'));

/*
Crafty.sprite("sprites.png", {
	brick1: [0,0,15,8],
	brick2: [15,0,15,8],
	brick3: [30,0,15,8],
	brick4: [45,0,15,8],		
	brick5: [60,0,15,8],
	ball: [0,8,10,10]
});

Crafty.scene("loading", function(){
	Crafty.load(["sprites.png"], function() {
		Crafty.scene("inGame");
	});	
});
*/

//playing game
Crafty.scene("inGame", function() {
	Crafty.background('#001');
	
	//paddle
	Crafty.e("Player, 2D, DOM, Color, Multiway")
		.attr({x:160, y:550, w:80, h:20})
		.color('#F00')
		.multiway(150, {LEFT_ARROW: 180, RIGHT_ARROW:0});

	//ball
	Crafty.e("2D, DOM, Color, Collision")
		.attr({x:195, y:540, w:10, h:10, combo: 0,
		direction: Crafty.math.randomInt(-3*Math.PI/4, -Math.PI/4)})
		.color('#EEF')
		.bind('EnterFrame', function(){
			//hit sides
			if (this.x < 0 || this.x > 390) {
				this.direction = Math.PI - this.direction;
			}
			//hit roof
			if (this.y < 0) {
				this.direction *= -1;
			}
			if (this.y > 600) {
				Crafty.scene("endGame", Crafty("Score").score);
			}
		
			this.x += 3 * Math.cos(this.direction);
			this.y += 3 * Math.sin(this.direction);
		})
		.onHit('Player', function(){
			this.combo = 0;
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
		.text("Game Over")
	//Score information
	Crafty.e("2D, DOM, Text")
		.attr({w:400, h:100, x:0, y:250})
		.textColor('#EEE')
		.textFont({size:'40px', weight:'bold'})
		.textAlign('center')
		.text("Score: " + score)
});

Crafty.scene("inGame");

};
