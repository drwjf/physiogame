define(["log", "loaders/sounds"],
  function(log, sounds) {

    var explosion,
      hitted;

    function init() {
      log.debug("soundController: init");
      explosion = sounds.getSound("explosion");
      hitted = sounds.getSound("hitted");
      bg = sounds.getSound("bg");

      background();
    }

    function explode() {
      explosion.play();
    }

    function hit() {
      hitted.play();
    }

    function background() {
      bg.loop = true;
      bg.play();
    }

    return {
      init: init,
      explode: explode,
      hit: hit,
      background: background
    };
  }
);