import { TimeSheetController } from "../../src/controller/TimeSheetController";
import { EmployeeModel } from "../../src/model/EmployeeModel";
import { TimeSheetView } from "../../src/view/TimeSheetView";

jest.mock("../../src/model/EmployeeModel");
jest.mock("../../src/view/TimeSheetView");

describe("logOut", () => {
  let removeItemMock;

  beforeEach(() => {
    removeItemMock = jest.spyOn(Storage.prototype, "removeItem");
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterEach(() => {
    // Clear mocks after each test
    jest.clearAllMocks();
  });

  it("should remove the token from localStorage and reload the page", () => {
    let controller;
    controller = new TimeSheetController();
    controller.logOut();

    expect(removeItemMock).toHaveBeenCalledWith("token");
    expect(window.location.reload).toHaveBeenCalled();
  });

  describe("login", () => {
    let setItemMock;
    let usernameInput;
    let passwordInput;

    beforeEach(() => {
      setItemMock = jest.spyOn(Storage.prototype, "setItem");

      usernameInput = document.createElement("input");
      usernameInput.id = "username";
      document.body.appendChild(usernameInput);

      passwordInput = document.createElement("input");
      passwordInput.id = "password";
      document.body.appendChild(passwordInput);
      jest.clearAllMocks();

      jest.spyOn(window, "alert").mockImplementation(() => {});
    });
    afterEach(() => {
      document.body.removeChild(usernameInput);
      document.body.removeChild(passwordInput);
    });

    it("", async () => {
      const mockData = {
        success: true,
        token: "testToken",
        username: "testUser",
      };
      EmployeeModel.mockImplementation(() => {
        return {
          login: jest.fn().mockResolvedValue(mockData),
        };
      });

      TimeSheetView.prototype.hideContent = jest.fn();
      TimeSheetView.prototype.updateEmployeeName = jest.fn();
      TimeSheetView.prototype.showContent = jest.fn();

      const controller = new TimeSheetController();

      controller.fetchAndDisplayTimeSheetData = jest.fn();
      controller.init = jest.fn();

      usernameInput.value = "testUser";
      passwordInput.value = "testPassword";

      await controller.login();

      expect(setItemMock).toHaveBeenCalledWith("token", "testToken");
      expect(setItemMock).toHaveBeenCalledWith("username", "testUser");
      expect(controller.view.hideContent).toHaveBeenCalled();
      expect(controller.view.updateEmployeeName).toHaveBeenCalled();
      expect(controller.fetchAndDisplayTimeSheetData).toHaveBeenCalled();
      expect(controller.view.showContent).toHaveBeenCalled();
      expect(controller.init).toHaveBeenCalled();
    });
  });
});

describe("handleTimeSheetChanges", () => {
  let controller;
  let event;

  beforeEach(() => {
    controller = new TimeSheetController();
    controller.view = new TimeSheetView();
    jest.spyOn(controller.view, "calculateWorkingHours").mockImplementation(() => {});

    event = {
      target: document.createElement("input"),
    };
  });

  it("should call calculateWorkingHours if event target has class 'time-start'", () => {
    event.target.classList.add("time-start");
    controller.handleTimeSheetChanges(event);
    expect(controller.view.calculateWorkingHours).toHaveBeenCalled();
  });

  it("should call calculateWorkingHours if event target has class 'time-end'", () => {
    event.target.classList.add("time-end");
    controller.handleTimeSheetChanges(event);
    expect(controller.view.calculateWorkingHours).toHaveBeenCalled();
  });
});

describe("fetchAndDisplayTimeSheetData", () => {
  let controller;
  let mockToken;
  let mockData;
  let mockFilteredData;

  beforeEach(() => {
    controller = new TimeSheetController();

    mockToken = "mockToken";
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(mockToken);
    console.log(jest.spyOn(Storage.prototype, "getItem").mockReturnValue(mockToken));

    mockData = [
      { date: "2024-05-01", hours: 8 },
      { date: "2024-05-02", hours: 7 },
    ];

    mockFilteredData = mockData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === 4 && itemDate.getFullYear() === 2024;
    });

    controller.model = {
      fetchTimeSheetData: jest.fn().mockResolvedValue(mockData),
      calculateDaysForMonth: jest.fn().mockReturnValue(["2024-05-01", "2024-05-02", "2024-05-03"]),
    };

    controller.view = {
      displayTimeSheetData: jest.fn(),
      updateDOMWithDays: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call displayTimeSheetData if data is found for the given month and year", async () => {
    await controller.fetchAndDisplayTimeSheetData(4, 2024);
    expect(controller.model.fetchTimeSheetData).toHaveBeenCalledWith(mockToken, 4, 2024);
    expect(controller.view.displayTimeSheetData).toHaveBeenCalledWith(mockFilteredData, 4, 2024);
  });
});
