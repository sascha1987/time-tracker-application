import { JSDOM } from "jsdom";
import { TextEncoder, TextDecoder } from "util";
import { TimeSheetView } from "../../src/view/TimeSheetView";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let dom, document, view;
view = new TimeSheetView();

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
  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><html><body>
      <table id="timeSheet"><tbody></tbody></table>
    </body></html>`);
    document = dom.window.document;
    global.document = document;
  });
  test("should update the DOM based on the given array of days", () => {
    const daysArray = [{ date: "01.01.2020" }, { date: "02.01.2020" }];

    view.updateDOMWithDays(daysArray);
    const tableBody = document.querySelector("#timeSheet tbody");

    expect(tableBody.rows.length).toBe(daysArray.length);
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
    view.calculateWorkingHours();
    const hoursNormalInput = document.querySelector(".hours-normal");
    expect(hoursNormalInput.value).toBe("9.00"); // 8 hours normal time + 1 hour overtime
  });
});
