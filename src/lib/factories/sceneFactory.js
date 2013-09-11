define(["log", "classes/Scene",
    "layers/aliens", "layers/background", "layers/clouds", "layers/crosshair",
    "layers/score", "layers/welcome"
  ],
  function(log, Scene,
    aliens, background, clouds, crosshair,
    score, welcome) {

    function makeScene(sceneID) {

      var scene;

      switch (sceneID) {

        case "startscreen":
          scene = new Scene({
            layers: [background, clouds, welcome, crosshair]
          });
          break;

        case "shooting":
          scene = new Scene({
            layers: [background, clouds, aliens, crosshair, score]
          });
          break;

        default:
          scene = new Scene({
            layers: [background]
          });
          log.warn("sceneID (" + sceneID + ") not found, returning default scene");
      }

      return scene;

    }

    return {
      makeScene: makeScene
    };
  }
);