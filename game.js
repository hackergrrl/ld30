function PlayState(game) {
}

PlayState.prototype.preload = function() {
  console.log('preload');

  game.load.image('star_small', 'assets/graphics/_star_small.png');
  game.load.image('star_big', 'assets/graphics/_star_big.png');

  game.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tileset', 'assets/graphics/_tileset.png');

  game.load.spritesheet('player', 'assets/graphics/_player.png', 17*4, 16*4);

  // game.load.audio('title', 'assets/music/title.mp3');

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();
};

PlayState.prototype.create = function() {
  console.log('create');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 1350;
  game.physics.arcade.TILE_BIAS = 40;

  // game.add.audio('title').play('', 0, 1, true);

  // game.stage.smoothed = false;
  // game.world.setBounds(0, 0, 2000, 2000);
  // game.camera.setBoundsToWorld();

  this.map = game.add.tilemap('level1');
  this.map.addTilesetImage('_tileset', 'tileset');
  this.bg = this.map.createLayer('BG');

  var stars = game.add.group();

  this.fg = this.map.createLayer('FG');
  this.map.setCollisionBetween(1, 5, true, this.fg);
  this.fg.resizeWorld();

  for (var i=0; i < 100; i++) {
    var sprite = (game.rnd.between(0,100) < 30) ? 'star_big' : 'star_small';
    var star = stars.create(game.rnd.between(0, game.world.width), game.rnd.between(0, 16 * 32), sprite);
    star.reset = function() {
      this.x = -10;
      this.y = game.rnd.between(0, 16 * 32);
      this.speed = game.rnd.frac() * this.maxSpeed;
    };
    star.maxSpeed = (sprite === 'star_big') ? 0.2 : 0.4;
    star.speed = game.rnd.frac() * star.maxSpeed;
    star.checkWorldBounds = true;
  }
  this.stars = stars;

  var player = game.add.sprite(16*4, 96*4, 'player');
  player.animations.add('idle', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 10, true);
  player.animations.add('jump_upward', [2], 10, false);
  player.animations.add('jump_downward', [3], 10, false);
  player.animations.play('idle');
  game.physics.enable(player);
  player.body.bounce.set(0.1, 0.03);
  player.body.collideWorldBounds = true;
  player.anchor.set(0.35, 0.5);
  player.walkForce = 1500;
  player.jumpForce = 500;
  player.body.drag.set(2000, 0);
  player.body.maxVelocity.x = 150;
  this.player = player;

  player.canJump = function() {
    return this.body.onFloor() || this.body.touching.down;
  };

  player.jump = function() {
    if (this.canJump()) {
      this.body.velocity.y = -this.jumpForce;
    }
  };

  player.update = function() {
    if (this.canJump()) {
      player.animations.play('idle');
    } else if (this.body.velocity.y < -10) {
      player.animations.play('jump_upward');
    } else if (this.body.velocity.y > 10) {
      player.animations.play('jump_downward');
    }
    console.log(player.body.velocity.y);
  };


  game.camera.follow(this.player);
};

PlayState.prototype.update = function() {
  game.physics.arcade.collide(this.player, this.fg);

  this.player.body.acceleration.x = 0;
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.player.body.acceleration.x = -this.player.walkForce;
    this.player.scale.x = -1;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.player.body.acceleration.x = this.player.walkForce;
    this.player.scale.x = 1;
  }

  this.player.update();

  if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
    this.player.jump();
  }

  this.stars.forEachAlive(function(s) {
    s.x += s.speed;
    if (s.x > game.world.width + 10) {
      s.x = -10;
      s.y = game.rnd.between(0, game.world.height);
      s.speed = game.rnd.frac() * s.maxSpeed + 0.5;
    }
  });
};






function TitleState(game) {
}

TitleState.prototype.preload = function() {
  console.log('preload');

  game.load.image('title_bg', 'assets/graphics/_title_bg.png');
  game.load.image('title_fg', 'assets/graphics/_title_fg.png');
  game.load.image('title_txt', 'assets/graphics/_title_text.png');

  game.load.image('star_small', 'assets/graphics/_star_small.png');
  game.load.image('star_big', 'assets/graphics/_star_big.png');

  game.load.spritesheet('player', 'assets/graphics/_player.png', 13*4, 12*4);

  game.load.audio('title', 'assets/music/title.mp3');

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();
};

TitleState.prototype.create = function() {
  console.log('create');

  game.add.audio('title').play('', 0, 1, true);

  game.stage.smoothed = false;
  game.world.setBounds(0, 0, 2000, 2000);
  game.camera.setBoundsToWorld();

  var bg = game.add.sprite(0, 0, 'title_bg');

  var stars = game.add.group();
  for (var i=0; i < 15; i++) {
    var sprite = (game.rnd.between(0,100) < 30) ? 'star_big' : 'star_small';
    var star = stars.create(game.rnd.between(0, game.width), game.rnd.between(0, game.height*2/5), sprite);
    star.maxSpeed = (sprite === 'star_big') ? 1.5 : 2.5;
    star.speed = game.rnd.frac() * star.maxSpeed + 0.5;
    star.checkWorldBounds = true;
  }
  this.stars = stars;

  var fg = game.add.sprite(0, 0, 'title_fg');

  this.fg_text = game.add.sprite(0, 0, 'title_txt');
  game.time.events.loop(Phaser.Timer.SECOND * 0.75, function() {
    this.visible = !this.visible;
  }, this.fg_text);

  var player = game.add.sprite(16*4, 64*4, 'player');
  player.animations.add('idle', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 10, true);
  player.animations.play('idle');
};

TitleState.prototype.update = function() {
  this.stars.forEachAlive(function(s) {
    s.x += s.speed;
    if (s.x > game.width + 10) {
      s.x = -10;
      s.y = game.rnd.between(0, game.height*2/5);
      s.speed = game.rnd.frac() * s.maxSpeed + 0.5;
    }
  });
};

var w = 160 * 4;
var h = 144 * 4;
var game = new Phaser.Game(w, h, Phaser.AUTO, 'monochain');
game.state.add('title', TitleState);
game.state.add('play', PlayState);
game.state.start('play');

