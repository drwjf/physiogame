define(["layers/crosshair", "displayFactory"],
  function (crosshair, displayFactory) {
    var scene = displayFactory.makeScene();
    scene.addChild(crosshair.getLayer());
    crosshair.activate();

    return {
      getScene: function getScene() {
        return scene;
      },
      toggleCrosshair: function toggleCrosshair() {
        if(crosshair.getRunning() === true) {
          crosshair.deactivate();
        } else {
          crosshair.activate();
        }
      }
    };
});