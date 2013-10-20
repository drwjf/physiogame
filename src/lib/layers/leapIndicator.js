define(["classes/Layer", "PIXI", "game/textures", "base/leapManager",
    "gameConfig"
  ],
  function(Layer, PIXI, textures, leapManager,
    gameConfig) {

    var layer = new Layer({
      listeners: {
        render: true,
        leap: true
      }
    });

    var outLeft,
      outRight,
      outTop,
      outBottom,
      noHand,
      minAlpha = 0.5,
      maxAlpha = 0.8,
      alphaModifier = 0.01,
      showThisLayer;

    layer.onActivate = function() {

      showThisLayer = gameConfig.get("leapShowIndicatorLayer");

      if (showThisLayer) {
        outLeft = new PIXI.Sprite(textures.atlas.leapOutside);
        outRight = new PIXI.Sprite(textures.atlas.leapOutside);
        outTop = new PIXI.Sprite(textures.atlas.leapOutside);
        outBottom = new PIXI.Sprite(textures.atlas.leapOutside);
        noHand = new PIXI.Sprite(textures.atlas.leapNoHand);

        outRight.rotation = Math.PI;
        outTop.rotation = Math.PI / 2;
        outBottom.rotation = -Math.PI / 2;

        outLeft.position = {
          x: 10,
          y: layer.height / 2
        };

        outRight.position = {
          x: layer.width - 10,
          y: layer.height / 2
        };

        outTop.position = {
          x: layer.width / 2,
          y: 10
        };

        outBottom.position = {
          x: layer.width / 2,
          y: layer.height - 10
        };

        noHand.position = {
          x: layer.width / 2,
          y: layer.height / 2
        };

        noHand.anchor = {
          x: 0.5,
          y: 0.5
        };

        noHand.scale = {
          x: 0.6,
          y: 0.6
        };

        applyOutsideOnlyParams(outLeft);
        applyOutsideOnlyParams(outRight);
        applyOutsideOnlyParams(outTop);
        applyOutsideOnlyParams(outBottom);

        applySharedParams(outLeft);
        applySharedParams(outRight);
        applySharedParams(outTop);
        applySharedParams(outBottom);

        applySharedParams(noHand);

        this.addChild(outLeft);
        this.addChild(outRight);
        this.addChild(outTop);
        this.addChild(outBottom);

        this.addChild(noHand);
      }
    };

    function applyOutsideOnlyParams(pixiSprite) {
      pixiSprite.anchor = {
        x: 0,
        y: 0.5
      };

      pixiSprite.scale = {
        x: 0.3,
        y: 0.3
      };
    }

    function applySharedParams(pixiSprite) {
      pixiSprite.reverseAlphaModifier = false;
      pixiSprite.alpha = minAlpha;
      pixiSprite.visible = false;
    }

    layer.onRender = function() {

      if (leapManager.getLeapConnected() === false) {
        noHand.visible = false;
        outLeft.visible = false;
        outRight.visible = false;
        outTop.visible = false;
        outBottom.visible = false;

        return;
      }

      if (showThisLayer) {
        if (leapManager.getHandsAvailable() === false) {
          noHand.visible = true;
          outLeft.visible = false;
          outRight.visible = false;
          outTop.visible = false;
          outBottom.visible = false;
        } else {
          noHand.visible = false;
        }

        animateIndicator(noHand);
        animateIndicator(outLeft);
        animateIndicator(outRight);
        animateIndicator(outTop);
        animateIndicator(outBottom);
      }
    };

    function animateIndicator(pixiSprite) {
      if (pixiSprite.visible === true) {
        if (pixiSprite.reverseAlphaModifier === false) {
          pixiSprite.alpha += alphaModifier;
        } else {
          pixiSprite.alpha -= alphaModifier;
        }

        if (pixiSprite.alpha > maxAlpha) {
          pixiSprite.reverseAlphaModifier = true;
        }

        if (pixiSprite.alpha < minAlpha) {
          pixiSprite.reverseAlphaModifier = false;
        }
      }
    }

    layer.onHandFrame = function(coordinates) {
      if (showThisLayer) {
        var outsideScreen = leapManager.getOutsideScreen();

        outLeft.visible = outsideScreen.left;
        outRight.visible = outsideScreen.right;
        outTop.visible = outsideScreen.top;
        outBottom.visible = outsideScreen.bottom;
      }
    };

    return layer;

  });