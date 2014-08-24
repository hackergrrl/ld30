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
  player.animations.add('jump_upward', [2], 10, false);
  player.animations.add('jump_downward', [3], 10, false);
  player.animations.play('idle');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 650;
  game.physics.arcade.TILE_BIAS = 40;

  // game.camera.follow(this.player);
};

TitleState.prototype.update = function() {
  // game.physics.arcade.collide(this.player, this.level.fgLayer);

  // this.player.body.acceleration.x = 0;
  // if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
  //   this.player.body.acceleration.x = -this.player.walkForce;
  //   this.player.scale.x = -1;
  // }
  // if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
  //   this.player.body.acceleration.x = this.player.walkForce;
  //   this.player.scale.x = 1;
  // }

  // this.player.update();

  // if (game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
  //   this.player.jump();
  // }

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
game.state.start('title');

