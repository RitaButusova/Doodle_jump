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
		//let backgr = this.add.image(400, 300, 'background');	
	
		// camera and platform tracking vars
		this.cameraYMin = 99999;
		this.platformYMin = 99999;

		// cursor controls
		this.cursor = this.input.keyboard.createCursorKeys();

		//Get the dimensions of the tile we are using
		this.tileWidth = this.textures.get('tile').getSourceImage().width;
		this.tileHeight = this.textures.get('tile').getSourceImage().height;

		//platforms create
		this.addPlatform();

		//doodle create
		this.doodleCreate();

		//camera
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0);
		// make the camera follow the player
		this.cameras.main.startFollow(this.doodle);
		
		// set background color, so the sky is not black    
		this.cameras.main.setBackgroundColor('#ccccff'); 

		// hero collisions and movement
		//this.platforms.setCollisionByExclusion([-1]);
		this.physics.add.collider(this.doodle, this.platforms);

		console.log(this.doodle, this.platforms)
		this.doodleMove();


	}
	update() {
		// the y offset and the height of the world are adjusted
		// to match the highest point the hero has reached
		this.physics.world.setBounds(0, -this.doodle.yChange, this.physics.world.width, this.game.height + this.doodle.yChange);

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
		this.platforms = this.add.group();
		this.platforms.enableBody = true;
		this.platforms.immovable = true;
		this.platforms.createMultiple(250, 'tile');

		// create the base platform, with buffer on either side so that the hero doesn't fall through
		this.addTile(-16, this.physics.world.bounds.height - 16, this.physics.world.bounds.height - 16);
		
		// create a batch of platforms that start to move up the level
		for( var i = 0; i < 9; i++ ) {
			this.addTile(Phaser.Math.RND.between(0, this.physics.world.bounds.width - 50), this.physics.world.bounds.height - 100 - 100 * i);
		}
    }
	doodleCreate() {
		// basic doodle setup
		this.doodle = this.physics.add.sprite(100, 450, 'playerSheet', 'playerSheet-0.png');

		this.doodle.setBounce(0.2); // our player will bounce from items
		this.doodle.setCollideWorldBounds(true);
		
		// track where the doodle started and how much the distance has changed from that point
		this.doodle.yOrig = this.doodle.y;
		this.doodle.yChange = 0;
	
		// doodle collision setup
		// disable all collisions except for down
		this.physics.world.enable(this.doodle);
		this.doodle.enableBody = true;
		this.doodle.body.gravity.y = 500;
		this.doodle.body.checkCollision.up = false;
		this.doodle.body.checkCollision.left = false;
		this.doodle.body.checkCollision.right = false;
	  }
	
	doodleMove() {
		// handle the left and right movement of the doodle
		if(this.cursor.left.isDown){
			this.doodle.body.setVelocityX(-200); // move left
		} else if(this.cursor.right.isDown){
			this.doodle.body.setVelocityX(200); // move right
		} else {
		  	this.doodle.body.setVelocityX(0);
		}
	
		// handle doodle jumping
		if(this.cursor.up.isDown && this.doodle.body.touching.down) {
			this.doodle.body.setVelocityY(-500); // jump up
		} 
	  }
	
}

var config = {
	type: Phaser.AUTO,
	width: 500,
	height: 500,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200}
		}
	},
	scene: Game
};


var game = new Phaser.Game(config);



