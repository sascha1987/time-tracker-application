import { EmployeeModel } from "../../src/model/EmployeeModel";

describe("EmployeeModel", () => {
  let model;

  beforeEach(() => {
    model = new EmployeeModel();
  });

  test("calculateDaysForMonth should return correct number of days for January 2020", () => {
    const result = model.calculateDaysForMonth(2020, 0);
    expect(result).toHaveLength(31);
    expect(result[0].date).toBe("01.01.2020");
    expect(result[30].date).toBe("31.01.2020");
  });

  test("calculateDaysForMonth should return correct number of days for February 2020 (leap year)", () => {
    const result = model.calculateDaysForMonth(2020, 1);
    expect(result).toHaveLength(29);
    expect(result[0].date).toBe("01.02.2020");
    expect(result[28].date).toBe("29.02.2020");
  });

  test("calculateDaysForMonth should return correct number of days for April 2021", () => {
    const result = model.calculateDaysForMonth(2021, 3);
    expect(result).toHaveLength(30);
    expect(result[0].date).toBe("01.04.2021");
    expect(result[29].date).toBe("30.04.2021");
  });
});
