/*global tddjs, describe, expect, it*/
(function () {
  "use strict";

  describe("Ship", function() {
    it("should take hit", function() {
      var ship = new Ship(3);

      expect(function () { ship.hit(0); }).not.toThrow();;
    });
  });

}());







