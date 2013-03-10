/*global tddjs*/

tddjs.namespace("battleship");
(function () {
  "use strict";

  function Ship(length) {
    var i;
    this.length = length;
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

  function Board() {
    this.ships = [];
    var length = 10,
      i,
      j;
    this.map = [];
    for (i = 0; i < length; i += 1) {
      this.map[i] = [];
      for (j = 0; j < length; j += 1) {
        this.map[i][j] = new Square();
      }
    }
  }

  Board.prototype.addShip = function (ship, start, end) {
    var i, vlen, hlen, count = 0;

    if (
      start[0] >= this.map.length ||
        start[0] < 0 ||
        start[1] >= this.map[start[0]].length ||
        start[1] < 0 ||
        end[0] >= this.map.length ||
        end[0] < 0 ||
        end[1] >= this.map[end[0]].length ||
        end[1] < 0 ||
        start[0] > end[0] ||
        start[1] > end[1]
    ) {
      throw new Error("Invalid position");
    }

    vlen = end[0] - start[0] + 1; // coordinates are inclusive
    hlen = end[1] - start[1] + 1;

    // Check if a ship is occupying any spaces:
    if (start[0] === end[0] && hlen === ship.length) {
      for (i = start[1]; i <= end[1]; i += 1) {
        if(this.map[start[0]][i].ship) {
          throw new Error ("Overlapping ships not allowed");
        }
      }
    } else if (start[1] === end[1] && vlen === ship.length) {
      for (i = start[0]; i <= end[0]; i += 1) {
        if(this.map[i][start[1]].ship) {
          throw new Error ("Overlapping ships not allowed");
        }
      }
    }

    if (start[0] === end[0] && hlen === ship.length) {
      for (i = start[1]; i <= end[1]; i += 1, count += 1) {
        this.map[start[0]][i].addShip(ship, count);
      }
    } else if (start[1] === end[1] && vlen === ship.length) {
      for (i = start[0]; i <= end[0]; i += 1, count += 1) {
        this.map[i][start[1]].addShip(ship, count);
      }
    } else {
      throw new Error("Invalid position");
    }
    this.ships.push(ship);
  };

  Board.prototype.attack = function (pos) {
    this.map[pos[0]][pos[1]].hit();
  };
  Board.prototype.gameOver = function () {
    var i;
    for ( i = 0; i < this.ships.length; i += 1) {
      if (!this.ships[i].isSunk()) {
        return false;
      }
    }
    return true;
  };

  tddjs.battleship.Ship = Ship;
  tddjs.battleship.Square = Square;
  tddjs.battleship.Board = Board;

}());

