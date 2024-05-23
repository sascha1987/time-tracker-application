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
});
