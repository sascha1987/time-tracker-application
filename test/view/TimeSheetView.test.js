import { JSDOM } from "jsdom";
import { TimeSheetView } from "../../src/view/TimeSheetView";
import { EmployeeModel } from "../../src/model/EmployeeModel";
let view, model;
view = new TimeSheetView();
model = new EmployeeModel();

describe("updateEmployeeName", () => {
  let getItemMock, employeeNameElement;

  beforeEach(() => {
    // Mocking localStorage.getItem
    getItemMock = jest.spyOn(Storage.prototype, "getItem");
    // Setting up DOM element
    document.body.innerHTML = `
      <section class="time-tracking">
        <div class="employee">
          <label>Employee:</label>
          <span id="employeeName"></span>
        </div>
        <div class="employer">
          <label>Employer : VP Bank AG</label>
        </div>
      </section>
    `;
    employeeNameElement = document.getElementById("employeeName");
  });

  afterEach(() => {
    // Clear mocks after each test
    jest.clearAllMocks();
  });
  it("should update the employee name when username is present in localStorage", () => {
    const username = "John Doe";
    getItemMock.mockReturnValue(username);
    view.updateEmployeeName();
    expect(employeeNameElement.textContent).toBe(username);
  });

  it("should not update the employee name when username is not present in localStorage", () => {
    getItemMock.mockReturnValue(null);
    view.updateEmployeeName();
    expect(employeeNameElement.textContent).toBe("");
  });

  it("should log an error when employeeName element is not found", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    getItemMock.mockReturnValue("John Doe");
    document.getElementById = jest.fn().mockReturnValue(null);
    view.updateEmployeeName();
    expect(consoleErrorMock).toHaveBeenCalledWith("Element or username not found");
    consoleErrorMock.mockRestore();
  });
});
