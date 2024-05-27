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
