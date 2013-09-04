define(["log", "controllers/display", "controllers/leap", "controllers/scene", "key",
  "controllers/sound"
  ],
  function(log, display, leap, scene, key,
    sound) {

    // private
    var showDebug = false;

    function init() {
      log.debug("gameController: init");

      display.init();
      sound.init();
      scene.init();
      leap.init();

      scene.events.on("pushedScene", onSceneChanged);
      scene.pushScene("startscreen");
    }

    function onSceneChanged(newSceneName) {
      log.info("onSceneChanged: scenename=" + newSceneName);
    }

    function toggleDebugInfo() {
      if (showDebug === true) {
        display.events.off("debugInfo", logDebugText);
        leap.events.off("debugInfo", logDebugText);
        log.debug("hiding debug info (keyboard d)");
        showDebug = false;

      } else {
        display.events.on("debugInfo", logDebugText);
        leap.events.on("debugInfo", logDebugText);
        log.debug("showing debug info (keyboard d)");
        showDebug = true;
      }
    }

    key('enter', function() {
      toggleScene();
    });

    key('d', function() {
      toggleDebugInfo();
    });

    function toggleScene() {

      if(scene.getCurrentSceneID() === "shooting") {
        scene.pushScene("startscreen");
      } else {
        scene.pushScene("shooting");
      }
    }

    function logDebugText(debugText) {
      log.debug(debugText);
    }

    // public
    return {
      init: init
    };
  }
);