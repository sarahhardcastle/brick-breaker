Crafty.init(400,600,document.getElementById('game'));
Crafty.background('#001');


//paddle
Crafty.e("Player, 2D, DOM, Color, Multiway")
	.attr({x:160, y:550, w:80, h:20})
	.color('#F00')
	.multiway(150, {LEFT_ARROW: 180, RIGHT_ARROW:0});

//ball
Crafty.e("2D, DOM, Color, Collision")
	.attr({x:195, y:540, w:10, h:10, direction: Crafty.math.randomInt(-3*Math.PI/4, -Math.PI/4)})
	.color('#EEF')
	.bind('EnterFrame', function(){
		//hit sides
		if (this.x < 0 || this.x > 400) {
			this.direction = Math.PI - this.direction;
		}
		//hit roof
		if (this.y < 0) {
			this.direction *= -1;
		}
		
		this.x += 3 * Math.cos(this.direction);
		this.y += 3 * Math.sin(this.direction);
	})
	.onHit('Player', function(){
		this.direction *= -1;
	});
