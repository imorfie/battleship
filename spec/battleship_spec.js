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

}());







