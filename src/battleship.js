/*function Board() {
  var map = new Array(10);
  for (var i = 0; i < map.length; i += 1) {
    map[i] = new Array(10);
  }
}
*/
(function () {
  "use strict";

  function Ship(length) {
    var i;
    this.spots = [];
    for (i = 0; i < length; i += 0) {
      this.spots[i] = false;
    }
  }

  Ship.prototype.hit = function (position) {
    this.spots[position] = true;
  };

}());