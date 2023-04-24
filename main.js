class Game extends Phaser.Scene {
	preload() {
		this.load.image('background', 'assets/bg_layer1.png');
		this.load.multiatlas('playerSheet', 'assets/playerSheet.json', 'assets');

		this.load.image('tile', 'assets/ground_grass.png');
		//Jumper Pack by Kenney Vleugels for Kenney (www.kenney.nl)
		//License (Creative Commons Zero, CC0)
		//http://creativecommons.org/publicdomain/zero/1.0/
	}
	create() {	
		// camera and platform tracking vars
		this.cameraYMin = 99999;
		this.platformYMin = 99999;

		//Get the dimensions of the tile we are using
		this.tileWidth = this.textures.get('tile').getSourceImage().width;
		this.tileHeight = this.textures.get('tile').getSourceImage().height;

		//platforms create
		this.addPlatform();

		//doodle create
		this.doodleCreate();

		//camera
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, this.physics.world.width, this.physics.world.height)
		this.physics.world.setBounds(0, 0, this.physics.world.width, this.physics.world.height)
		// make the camera follow the player
		this.cameras.main.startFollow(this.doodle, true, 0, 0.5);
		
		// set background color, so the sky is not black    
		this.cameras.main.setBackgroundColor('#ccccff'); 


		// cursor controls
		this.cursor = this.input.keyboard.createCursorKeys();	
	}
	update() {
		// the y offset and the height of the world are adjusted
		// to match the highest point the hero has reached
		this.physics.world.setBounds(0, -this.doodle.yChange, this.physics.world.width, this.game.height + this.doodle.yChange);
		// the built in camera follow methods won't work for our needs
		// this is a custom follow style that will not ever move down, it only moves up
		this.cameraYMin = Math.min(this.cameraYMin, this.doodle.y - this.game.config.height + 430);
		this.cameras.y = this.cameraYMin;
		//console.log(this.cameras.y)

		// hero collisions and movement
		this.physics.add.collider(this.doodle, this.platforms);
		this.doodleMove();
	}
	addTile(x, y, width){
		let tile = this.platforms.create(x, y, 'tile');
		tile.setScale(0.3, 0.3)
		tile.width = this.tileWidth;
		tile.height = this.tileHeight;
		if(width) {
			tile.scaleX = width;
		}
        return tile;
    }
    addPlatform(){
		// platform basic setup
		//Get the dimensions of the tile we are using
		this.platforms = this.physics.add.group({immovable: true});
		this.platforms.enableBody = true;
		this.platforms.createMultiple(250, 'tile');

		// create the base platform, with buffer on either side so that the hero doesn't fall through
		this.addTile(-16, this.physics.world.bounds.height - 16, this.physics.world.bounds.height - 16);
		
		// create a batch of platforms that start to move up the level
		for( var i = 0; i < 150; i++ ) {
			this.addTile(Phaser.Math.RND.between(0, this.physics.world.bounds.width - 70), this.physics.world.bounds.height - 200 - 200 * i);
		}
    }
	doodleCreate() {
		// basic doodle setup
		this.doodle = this.physics.add.sprite(100, 700, 'playerSheet', 'playerSheet-0.png');
		this.doodle.setBounce(0.2); // our player will bounce from items
		this.doodle.setCollideWorldBounds(true);
		
		// track where the doodle started and how much the distance has changed from that point
		this.doodle.yOrig = this.doodle.y;
		this.doodle.yChange = 0;
	
		// doodle collision setup
		// disable all collisions except for down
		this.physics.world.enable(this.doodle);
		//this.doodle.enableBody = true;
		this.doodle.body.gravity.y = 830;
		this.doodle.body.checkCollision.up = false;
		this.doodle.body.checkCollision.left = false;
		this.doodle.body.checkCollision.right = false;
	  }
	
	doodleMove() {
		// handle the left and right movement of the doodle
		if(this.cursor.left.isDown){
			this.doodle.body.setVelocityX(-100); // move left
		} else if(this.cursor.right.isDown){
			this.doodle.body.setVelocityX(100); // move right
		} else {
		  	this.doodle.body.setVelocityX(0);
		}
	
		// handle doodle jumping
		if(this.cursor.up.isDown && this.doodle.body.touching.down) {
			this.doodle.body.setVelocityY(-250); // jump up
		} 

		// track the maximum amount that the hero has travelled
		this.doodle.yChange = Math.max(this.doodle.yChange, Math.abs(this.doodle.y - this.doodle.yOrig));
		// if the hero falls below the camera view, gameover
		//console.log(this.cameraYMin, this.doodle.y, this.game.config.height)
		if(this.doodle.y < this.cameraYMin + this.game.config.height) {
		  console.log('gameover')
		}
	  }
}

var config = {
	type: Phaser.AUTO,
	width: 500,
	height: 830,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200}
		}
	},
	scene: Game
};


var game = new Phaser.Game(config);



