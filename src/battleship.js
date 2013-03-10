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

  function Square() {
    this.ship = undefined;
    this.position = undefined;
    this.state = "open";
  }

  Square.prototype.addShip = function (ship, position) {
    this.ship = ship;
    this.position = position;
  };

  Square.prototype.hit = function () {
    if (this.ship) {
      this.ship.hit(this.position);
      this.state = "hit";
    } else {
      this.state = "miss";
    }
  };

  tddjs.battleship.Ship = Ship;
  tddjs.battleship.Square = Square;

}());

