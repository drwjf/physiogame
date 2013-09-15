define(["display/textures", "display/factory", "config", "utils/hittest", "underscore", "PIXI",
    "entities/scoreEntity", "base/soundManager", "gameObjects/crosshairSprite", "classes/Layer"
  ],
  function(textures, factory, config, hittest, _, PIXI, scoreEntity, soundManager, crosshairSprite, Layer) {

    var layer = new Layer({
      listeners: {
        render: true,
        leap: true
      }
    });

    var aliensArray = [],
      alienHittedScaleCap = 1,
      alienHittedScaleBeforeCap = 0.12,
      alienHittedScaleAfterCap = 0.08,
      alienHittedSpeedMax = 5,
      alienHittedSpeedStep = 1,
      alienHittedAlphaStep = 0.2,
      alienNormalScaleMin = 0.25,
      alienNormalScaleCap = 0.9,
      alienNormalScaleBeforeCap = 0.02,
      alienNormalScaleAfterCap = 0.003,
      explosionsClearing = [];

    layer.onActivate = function() {
      createAliens();

      crosshairSprite.events.on("crosshairActive", detectCrosshairHitsAlien);
    };

    layer.onDeactivate = function() {
      crosshairSprite.events.off("crosshairActive", detectCrosshairHitsAlien);

      aliensArray = [];
      explosionsClearing = [];
    };

    layer.onRender = function() {
      onRenderMove();
      onRenderClearExplosions();
    };

    layer.onHandFrame = function(coordinates) {
      detectCrosshairHitsAlien(coordinates);
    };

    function detectCrosshairHitsAlien(coordinates) {
      var i = 0,
        hitted = false,
        max = aliensArray.length,
        hitCord = _.extend(coordinates, {
          width: 20,
          height: 20,
          anchor: {
            x: 0.5,
            y: 0.5
          }
        });

      for (i; i < max; i += 1) {
        if (aliensArray[i].visible === true) {
          hitted = hittest(aliensArray[i], hitCord);
          if (aliensArray[i].hitted !== hitted) {
            soundManager.hit();
          }
          aliensArray[i].hitted = hitted;
        }
      }
    }


    function createAliens() {

      var aliensToSpawn = config.get("aliensToSpawn"),
        i = 0,
        frameName,
        asien;
      // add aliens...
      for (i = 0; i < aliensToSpawn; i += 1) {
        frameName = textures.alienFrames[i % 4];

        // create an alien using the frame name..
        alien = factory.makePIXISprite(textures.getTextureByName(frameName));

        // set its initial values...
        alien.position.x = parseInt(Math.random() * layer.width, 10);
        alien.position.y = parseInt(Math.random() * layer.height, 10);
        alien.targetX = parseInt(Math.random() * layer.width, 10); // extra
        alien.targetY = parseInt(Math.random() * layer.height, 10); // extra
        alien.anchor.x = 0.5;
        alien.anchor.y = 0.5;
        alien.scale.x = 0.2;
        alien.scale.y = 0.2;
        alien.hitted = false; // extra
        alien.alpha = 0.5;
        alien.speed = 1; // extra

        aliensArray.push(alien);
        layer.addChild(aliensArray[i]);
      }
    }

    function onRenderClearExplosions() {
      var i = 0,
        length = explosionsClearing.length;
      for (i; i < length; i += 1) {
        if (explosionsClearing[i].alpha > 0) {
          explosionsClearing[i].alpha -= 0.01;
        } else {
          layer.removeChild(explosionsClearing.splice(i, 1)[0]);
          i -= 1;
          length -= 1;
        }
      }
    }

    function onRenderMove() {
      var i = 0,
        max = aliensArray.length,
        alien;

      for (i; i < max; i += 1) {

        alien = aliensArray[i];

        if (alien.visible === true) {

          if (alien.position.x < alien.targetX) {
            alien.position.x += alien.speed;
          }
          if (alien.position.x > alien.targetX) {
            alien.position.x -= alien.speed;
          }
          if (alien.position.y < alien.targetY) {
            alien.position.y += alien.speed;
          }
          if (alien.position.y > alien.targetY) {
            alien.position.y -= alien.speed;
          }
          if (alien.position.x === alien.targetX) {
            alien.targetX = parseInt(Math.random() * layer.width, 10);
          }
          if (alien.position.y === alien.targetY) {
            alien.targetY = parseInt(Math.random() * layer.height, 10);
          }

          if (alien.hitted === true) {
            if (alien.scale.x < alienHittedScaleCap) {
              alien.scale.x += alienHittedScaleBeforeCap;
              alien.scale.y += alienHittedScaleBeforeCap;
            } else {
              alien.scale.x += alienHittedScaleAfterCap;
              alien.scale.y += alienHittedScaleAfterCap;
            }
            if (alien.alpha < 1) {
              alien.alpha += alienHittedAlphaStep;
            }
            if (alien.speed <= alienHittedSpeedMax) {
              alien.speed += alienHittedSpeedStep;
            }

          } else {
            if (alien.scale.x > alienNormalScaleMin) {
              if (alien.scale.x > alienNormalScaleCap) {
                alien.scale.x -= alienNormalScaleBeforeCap;
                alien.scale.y -= alienNormalScaleBeforeCap;
              } else {
                alien.scale.x -= alienNormalScaleAfterCap;
                alien.scale.y -= alienNormalScaleAfterCap;
              }

            }
            if (alien.alpha > 0.5) {
              alien.alpha -= 0.01;
            }

            if (alien.speed > 1) {
              alien.speed -= 1;
            }
          }

          if (alien.scale.x > 1.8) { // boom
            alien.visible = false;

            var explosion = new PIXI.MovieClip(textures.explosionTextures);

            explosion.position.x = aliensArray[i].position.x;
            explosion.position.y = aliensArray[i].position.y;
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;

            explosion.rotation = Math.random() * Math.PI;
            explosion.scale.x = explosion.scale.y = 0.75 + Math.random() * 0.5;

            explosion.loop = false;
            explosion.gotoAndPlay(0);

            soundManager.explode();

            explosion.onComplete = onExplosionComplete;


            layer.addChild(explosion);

            scoreEntity.raiseScore();
          }
        }

      }
    }

    function onExplosionComplete() {
      explosionsClearing.push(this);
    }

    return layer;
  }
);