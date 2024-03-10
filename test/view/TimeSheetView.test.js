//import { JSDOM } from "jsdom";
import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import { calculateDaysForMonth, updateDOMWithDays } from "../../src/view/TimeSheetView.js";

// before(() => {
//   const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
//   global.document = dom.window.document;
// });

describe("calculateDaysForMonth", function () {
  it("should return 31 days for January 2020", function () {
    const result = calculateDaysForMonth(2020, 0);
    expect(result).to.have.lengthOf(31);
  });
  it("should return 29 days for February 2020 (leap year)", function () {
    const result = calculateDaysForMonth(2020, 1);
    expect(result).to.have.lengthOf(29);
  });

  it("should format dates corrctly for March 2021", function () {
    const result = calculateDaysForMonth(2021, 2);
    expect(result[0].date).to.equal("01.03.2021");
    expect(result[30].date).to.equal("31.03.2021");
  });
});

// after(() => {
//   delete global.document;
// });
