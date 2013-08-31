define(["displayController", "leapController", "sceneController", "key",
    "display/assets", "soundController", "display/fonts"
  ],
  function(displayController, leapController, sceneController, key,
    assets, soundController, fonts) {

    // private
    var showDebug = false;

    // immediately invoked, inits gameController and child controllers
    (function preloading() {

      if (assets.assetsLoaded === true) {
        init();
      } else {
        assets.events.on("assetsLoaded", init);
      }
    }());

    function init() {
      console.log("gameController: init");

      assets.events.remove("assetsLoaded", init);

      displayController.init();
      sceneController.init();
      leapController.init();

      sceneController.events.on("showScene", sceneChanged);
      sceneController.showMainScene();
    }

    function sceneChanged(scene) {
      displayController.resize();
    }

    function toggleDebugInfo() {
      if (showDebug === true) {
        displayController.events.remove("debugInfo", logDebugText);
        leapController.events.remove("debugInfo", logDebugText);
        console.log("hiding debug info");
        showDebug = false;

      } else {
        displayController.events.on("debugInfo", logDebugText);
        leapController.events.on("debugInfo", logDebugText);
        console.log("showing debug info");
        showDebug = true;
      }
    }

    key('enter', function() {
      toggleDebugInfo();
    });

    function logDebugText(debugText) {
      console.log(debugText);
    }

    // public
    return {};
  }
);