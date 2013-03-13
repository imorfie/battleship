/*global battleship, document, $*/

var battleship = battleship || {};
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
    this.length = 10;
    var i, j;
    this.map = [];
    for (i = 0; i < this.length; i += 1) {
      this.map[i] = [];
      for (j = 0; j < this.length; j += 1) {
        this.map[i][j] = new Square();
      }
    }
  }
  function OverlapError(message) {
    this.name = "OverlapError";
    this.message = message || "Overlapping ships not allowed";
  }
  OverlapError.prototype = new Error();
  OverlapError.prototype.constructor = OverlapError;
  battleship.OverlapError = OverlapError;

  Board.prototype.addShip = function (ship, position) {
    var i, vlen, hlen, count = 0, start = position[0], end = position[1];

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
      throw new Error("Invalid position: (" + position[0] + "), (" + position[1] + "). Ship Length: " + ship.length);
    }

    vlen = end[0] - start[0] + 1; // coordinates are inclusive
    hlen = end[1] - start[1] + 1;

    // Check if a ship is occupying any spaces:
    if (start[0] === end[0] && hlen === ship.length) {
      for (i = start[1]; i <= end[1]; i += 1) {
        if (this.map[start[0]][i].ship) {
          throw new OverlapError();
        }
      }
    } else if (start[1] === end[1] && vlen === ship.length) {
      for (i = start[0]; i <= end[0]; i += 1) {
        if (this.map[i][start[1]].ship) {
          throw new battleship.OverlapError();
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
      throw new Error("Invalid position: (" + position[0] + "), (" + position[1] + "). Ship Length: " + ship.length);
    }
    this.ships.push(ship);
  };

  Board.prototype.attack = function (pos) {
    this.map[pos[0]][pos[1]].hit();
  };
  Board.prototype.gameOver = function () {
    var i;
    for (i = 0; i < this.ships.length; i += 1) {
      if (!this.ships[i].isSunk()) {
        return false;
      }
    }
    return true;
  };

  battleship.Ship = Ship;
  battleship.Square = Square;
  battleship.Board = Board;

  battleship.getRandomInt = function (min, max) {
    max -= 1; // max is exclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  battleship.createRandomShipPlacement = function (length) {
    var start = [], end = [], orientation, placement = [];
    orientation = battleship.getRandomInt(0, 2);
    if (orientation === 0) {
      start[0] = battleship.getRandomInt(0, 10);
      start[1] = battleship.getRandomInt(0, (10 - length + 1));

      end[0] = start[0];
      end[1] = (start[1] + length - 1);
    } else {
      start[0] = battleship.getRandomInt(0, (10 - length + 1));
      start[1] = battleship.getRandomInt(0, 10);

      end[0] = (start[0] + length - 1);
      end[1] = start[1];
    }
    placement = [start, end];
    return placement;
  };

  //initialize opponent
  battleship.opponent = new battleship.Board();
  var i, j,
    sizes = [2, 3, 3, 4, 5],
    ship;
  for (i = 0; i < sizes.length; i += 1) {
    ship = new battleship.Ship(sizes[i]);
    while ((i + 1) > battleship.opponent.ships.length) {
      try {
        battleship.opponent.addShip(ship, battleship.createRandomShipPlacement(sizes[i]));
      } catch (e) {
        if (!e instanceof battleship.OverlapError) {
          throw new Error("Error adding ship: " + e);
        }
      }
    }
  }
  battleship.cache = {};
  battleship.attackSquare = function () {
    var square = battleship.cache[$(this).attr('id')];
    square.hit();
    $(this).html(square.state);
  };
}());


$(document).ready(function () {
  "use strict";
  var i, j, row, cell,
    opponentTable = $('<table>').attr('id', 'opponentTable');
  for (i = 0; i < battleship.opponent.length; i += 1) {
    row = $('<tr>');
    for (j = 0; j < battleship.opponent.length; j += 1) {
      cell = $('<td>').html(battleship.opponent.map[i][j].state);
      cell.attr('id', String(i) + String(j));
      cell.click(battleship.attackSquare);
      battleship.cache[String(i) + String(j)] = battleship.opponent.map[i][j];
      row.append(cell);
    }
    opponentTable.append(row);
  }
  $('body').append(opponentTable);


});




