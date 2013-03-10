/*global tddjs, describe, expect, it*/
(function () {
  "use strict";

  describe("Ship", function () {
    describe("Creation error handling", function() {
      it("should throw if size is not greater than one", function() {
        expect(function () { var ship = new tddjs.battleship.Ship(-1); }).toThrow();
        expect(function () { var ship = new tddjs.battleship.Ship(0); }).toThrow();
        expect(function () { var ship = new tddjs.battleship.Ship({}); }).toThrow();
      });      
    });

    it("should take hit", function () {
      var ship = new tddjs.battleship.Ship(3);

      expect(function () { ship.hit(0); }).not.toThrow();
    });

    it("should throw if hit index is not in ship size", function() {
      var ship = new tddjs.battleship.Ship(3);

      expect(function () { ship.hit(4); }).toThrow();
      expect(function () { ship.hit(-1); }).toThrow();
      expect(function () { ship.hit({}); }).toThrow();
    });

    it("should report sunk when all positions are hit", function () {
      var ship = new tddjs.battleship.Ship(3);
      ship.hit(0);
      ship.hit(1);
      ship.hit(2);

      expect(ship.isSunk()).toBeTruthy();
    });

    it("should report not sunk when some positions are hit", function () {
      var ship = new tddjs.battleship.Ship(3);
      ship.hit(0);
      ship.hit(2);

      expect(ship.isSunk()).toBeFalsy();
    });
  });
  describe("Square", function() {
    it("should accept a Ship and position", function () {
      var square = new tddjs.battleship.Square();
      var ship = new tddjs.battleship.Ship(4);

      expect(function () { square.addShip(ship, 0); }).not.toThrow();

    });
    it("should pass on hit to the Ship", function () {
      var square = new tddjs.battleship.Square();
      var ship = new tddjs.battleship.Ship(4);
      square.addShip(ship, 0);

      square.hit();

      expect(ship.spots[0]).toBeTruthy();

    });
    describe("State", function() {
      it("should be open", function() {
        var square = new tddjs.battleship.Square();
        expect(square.state).toEqual("open");
      });
      it("should be miss", function() {
        var square = new tddjs.battleship.Square();
        square.hit();
        expect(square.state).toEqual("miss");
      });
      it("should be hit", function () {
        var square = new tddjs.battleship.Square();
        var ship = new tddjs.battleship.Ship(4);
        square.addShip(ship, 0);
        square.hit();

        expect(square.state).toEqual("hit");
      
      });
    });
  });
}());







