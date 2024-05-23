export class EmployeeModel {
  calculateDaysForMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${day.toString().padStart(2, "0")}.${(month + 1).toString().padStart(2, "0")}.${year}`;
      daysArray.push({ date: formattedDate });
    }
    //   console.log("returned days Array from calculateDaysForMonth", daysArray);
    return daysArray;
  }

  async validateToken(token) {
    const response = await fetch("http://localhost:5500/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  }

  async login(username, password) {
    const response = await fetch("http://localhost:5500/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  }

  async saveTimeSheetData(timeSheetData, token) {
    const response = await fetch("http://localhost:5500/save-timesheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ timeSheetData }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to save data");
    return data;
  }

  async fetchTimeSheetData(token, month, year) {
    // console.log("Fetching data with token:", token);
    const response = await fetch("http://localhost:5500/get-timesheet", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    //  console.log("Raw Data from server:", data);
    return data;
  }
}
