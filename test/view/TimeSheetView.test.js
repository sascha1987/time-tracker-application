import { JSDOM } from "jsdom";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import {
  calculateDaysForMonth,
  updateDOMWithDays,
  calculateWorkingHours,
} from "../../src/view/TimeSheetView.js";

let dom, document;

beforeEach(() => {
  dom = new JSDOM(`<!DOCTYPE html><html><body>
    <table id="timeSheet"><tbody></tbody></table>
  </body></html>`);
  document = dom.window.document;
  global.document = document;
});

afterEach(() => {
  delete global.document;
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

describe("calculateWorkingHours", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <table id="timeSheet">
    <tbody>
      <tr>
        <td><input type="time" class="time-start" value="08:00"></td>
        <td><input type="time" class="time-end" value="12:00"></td>
        <td><input type="time" class="time-start-1" value="13:00"></td>
        <td><input type="time" class="time-end-1" value="18:00"></td>
        <td><input type="text" class="hours-normal" readonly></td>
        <td><input type="text" class="overtime" readonly></td>
      </tr>
    </tbody>
  </table>
`;
  });

  it("shoud calcualte total and overtime hours", () => {
    calculateWorkingHours();

    const hoursNormalInput = document.querySelector(".hours-normal");

    expect(hoursNormalInput.value).to.equal("9.00"); // 8 hours normal Time + 1 hours overtime;
  });
});
