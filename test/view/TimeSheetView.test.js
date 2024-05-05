import { JSDOM } from "jsdom";
import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import { calculateDaysForMonth, updateDOMWithDays } from "../../src/view/TimeSheetView.js";

let dom, document;

before(() => {
  dom = new JSDOM(`<!DOCTYPE html><html><body>
    <table id="timeSheet"><tbody></tbody></table>
  </body></html>`);
  document = dom.window.document;
  global.document = document;
});

describe("updateDOMWithDays", function () {
  it("should update the DOM based on the given year and month", function () {
    const year = 2020;
    const month = 0;

    updateDOMWithDays.call({ document }, year, month);
    const tableBody = document.querySelector("#timeSheet tbody");

    expect(tableBody.rows.length).to.equal(31);
  });
});

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

after(() => {
  delete global.document;
});
