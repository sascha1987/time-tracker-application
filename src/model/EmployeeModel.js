export class EmployeeModel {
  calculateDaysForMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${day.toString().padStart(2, "0")}.${(month + 1).toString().padStart(2, "0")}.${year}`;
      daysArray.push({ date: formattedDate });
    }
    return daysArray;
  }
}
