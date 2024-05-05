import { JSDOM } from "jsdom";
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import { calculateDaysForMonth, updateDOMWithDays, calculateWorkingHours } from "../../src/view/TimeSheetView.js";

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

describe("updateDOMWithDays", () => {
  test("should update the DOM based on the given year and month", () => {
    const year = 2020;
    const month = 0;

    updateDOMWithDays.call({ document }, year, month);
    const tableBody = document.querySelector("#timeSheet tbody");

    expect(tableBody.rows.length).toBe(31);
  });
});

describe("calculateDaysForMonth", () => {
  test("should return 31 days for January 2020", () => {
    const result = calculateDaysForMonth(2020, 0);
    expect(result).toHaveLength(31);
  });

  test("should return 29 days for February 2020 (leap year)", () => {
    const result = calculateDaysForMonth(2020, 1);
    expect(result).toHaveLength(29);
  });

  test("should format dates correctly for March 2021", () => {
    const result = calculateDaysForMonth(2021, 2);
    expect(result[0].date).toBe("01.03.2021");
    expect(result[30].date).toBe("31.03.2021");
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
      <footer>
      <div class="footer-total">
        Total Hours: <span id="totalHours">0</span>
      </div>
    </footer>
    `;
  });

  test("should calculate total and overtime hours", () => {
    calculateWorkingHours();
    const hoursNormalInput = document.querySelector(".hours-normal");
    expect(hoursNormalInput.value).toBe("9.00"); // 8 hours normal time + 1 hour overtime
  });
});
