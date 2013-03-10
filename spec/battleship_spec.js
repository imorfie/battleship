/*global battleship, describe, expect, it*/
(function () {
  "use strict";

  describe("Ship", function () {
    describe("Creation error handling", function() {
      it("should throw if size is not greater than one", function() {
        expect(function () { var ship = new battleship.Ship(-1); }).toThrow();
        expect(function () { var ship = new battleship.Ship(0); }).toThrow();
        expect(function () { var ship = new battleship.Ship({}); }).toThrow();
      });      
    });

    it("should take hit", function () {
      var ship = new battleship.Ship(3);

      expect(function () { ship.hit(0); }).not.toThrow();
    });

    it("should throw if hit index is not in ship size", function() {
      var ship = new battleship.Ship(3);

      expect(function () { ship.hit(4); }).toThrow();
      expect(function () { ship.hit(-1); }).toThrow();
      expect(function () { ship.hit({}); }).toThrow();
    });

    it("should report sunk when all positions are hit", function () {
      var ship = new battleship.Ship(3);
      ship.hit(0);
      ship.hit(1);
      ship.hit(2);

      expect(ship.isSunk()).toBeTruthy();
    });

    it("should report not sunk when some positions are hit", function () {
      var ship = new battleship.Ship(3);
      ship.hit(0);
      ship.hit(2);

      expect(ship.isSunk()).toBeFalsy();
    });
  });
  describe("Square", function() {
    it("should accept a Ship and position", function () {
      var square = new battleship.Square();
      var ship = new battleship.Ship(4);

      expect(function () { square.addShip(ship, 0); }).not.toThrow();

    });
    it("should pass on hit to the Ship", function () {
      var square = new battleship.Square();
      var ship = new battleship.Ship(4);
      square.addShip(ship, 0);

      square.hit();

      expect(ship.spots[0]).toBeTruthy();

    });
    describe("State", function() {
      it("should be open", function() {
        var square = new battleship.Square();
        expect(square.state).toEqual("open");
      });
      it("should be miss", function() {
        var square = new battleship.Square();
        square.hit();
        expect(square.state).toEqual("miss");
      });
      it("should be hit", function () {
        var square = new battleship.Square();
        var ship = new battleship.Ship(4);
        square.addShip(ship, 0);
        square.hit();

        expect(square.state).toEqual("hit");
      
      });
    });
  });
  describe("Board", function() {
    it("should accept ship and location", function() {
      var ship = new battleship.Ship(5);
      var board = new battleship.Board();

      expect(function () { board.addShip(ship, [0,0], [0,4]); }).not.toThrow();

    });
    describe("Ensure all occupied squares are filled", function () {
      it("should fill squares for vertical shipts", function() {
      var ship = new battleship.Ship(5);
      var board = new battleship.Board();
      board.addShip(ship, [0,0], [0,4]); 

      expect(board.map[0][0].ship).toEqual(ship);
      expect(board.map[0][1].ship).toEqual(ship);
      expect(board.map[0][2].ship).toEqual(ship);
      expect(board.map[0][3].ship).toEqual(ship);
      expect(board.map[0][4].ship).toEqual(ship);
        
      });
      it("should fill squares for horizontal shipts", function() {
      var ship = new battleship.Ship(5);
      var board = new battleship.Board();
      board.addShip(ship, [0,0], [4,0]); 

      expect(board.map[0][0].ship).toEqual(ship);
      expect(board.map[1][0].ship).toEqual(ship);
      expect(board.map[2][0].ship).toEqual(ship);
      expect(board.map[3][0].ship).toEqual(ship);
      expect(board.map[4][0].ship).toEqual(ship);

      });
    });
    it("should register hits for horizontal boats", function () {
      var ship = new battleship.Ship(5);
      var board = new battleship.Board();
      board.addShip(ship, [0,0], [0,4]); 
      board.attack([0,0]);

      expect(ship.spots[0]).toBeTruthy();

    });
    it("should register hits for vertical boats", function () {
      var ship = new battleship.Ship(5);
      var board = new battleship.Board();
      board.addShip(ship, [0,0], [4,0]); 
      board.attack([0,0]);

      expect(ship.spots[0]).toBeTruthy();
      board.attack([1,0]);
      expect(ship.spots[0]).toBeTruthy();
      expect(ship.spots[1]).toBeTruthy();

    });
    it("should report when all ships are destroyed", function() {
      var ship = new battleship.Ship(5);
      var board = new battleship.Board();
      board.addShip(ship, [2,2], [2,6]); 
      board.attack([2,2]);
      board.attack([2,3]);
      board.attack([2,4]);
      board.attack([2,5]);
      board.attack([2,6]);

      expect(ship.isSunk()).toBeTruthy();
      expect(board.gameOver()).toBeTruthy();

    });
    describe("Error Handling", function() {
      it("should not accept positions out of range", function () {
        var ship = new battleship.Ship(4);
        var board = new battleship.Board();
        
        expect(function () { board.addShip(ship, [11,0], [15,0]); }).toThrow();  
        expect(function () { board.addShip(ship, [7,0], [11,0]); }).toThrow();  
        expect(function () { board.addShip(ship, [0,4], [0,0]); }).toThrow();  

      });
      it("should not accept positions sized different than the ship", function() {
        var ship = new battleship.Ship(4);
        var board = new battleship.Board();
        
        expect(function () { board.addShip(ship, [4,4], [4,6]); }).toThrow();  
      });
      it("should not let ships overlap", function () {
        var ship1 = new battleship.Ship(4);
        var ship2 = new battleship.Ship(4);
        var board = new battleship.Board();
        board.addShip(ship1, [2,4], [2,7]);

        expect(function () { board.addShip(ship2, [1,5], [4,5]); }).toThrow();  
  
      });
    });
  });
}());







