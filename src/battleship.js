/*global tddjs*/
/*function Board() {
  var map = new Array(10);
  for (var i = 0; i < map.length; i += 1) {
    map[i] = new Array(10);
  }
}
*/
tddjs.namespace("battleship");
(function () {
  "use strict";

  function Ship(length) {
    var i;

    if ((typeof length !== "number") || length < 1) {
      throw new Error("length is less than 1");
    }

    this.spots = [];
    for (i = 0; i < length; i += 1) {
      this.spots[i] = false;
    }
  }

  Ship.prototype.hit = function (position) {
    if ((typeof position !== "number") || position < 0) {
      throw new Error("position is less than 1");
    }
    if (position >= this.spots.length) {
      throw new Error("Hit position is larger than ship");
    }
    this.spots[position] = true;
  };

  Ship.prototype.isSunk = function () {
    var i;
    for (i = 0; i < this.spots.length; i += 1) {
      if (this.spots[i] !== true) {
        return false;
      }
    }
    return true;
  };

  tddjs.battleship.Ship = Ship;

}());

