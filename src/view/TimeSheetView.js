import { EmployeeModel } from "../model/EmployeeModel.js";
export class TimeSheetView {
  constructor(controller) {
    this.controller = controller;
    this.model = new EmployeeModel();
  }

  displayTimeSheetData(data, month, year) {
    console.log("displayTimeSheetData called from view");
    const tableBody = document.getElementById("timeSheet").querySelector("tbody");
    tableBody.innerHTML = "";

    data.forEach((item) => {
      const dbDate = new Date(item.date);
      // Only display data for the selected month and year
      if (dbDate.getMonth() === month && dbDate.getFullYear() === year) {
        const formattedDate = `${dbDate.getDate().toString().padStart(2, "0")}.${(dbDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}.${dbDate.getFullYear()}`;
        const row = tableBody.insertRow();
        const formattedHoursNormal = item.hoursNormal ? parseFloat(item.hoursNormal).toFixed(2) : "";
        const formattedOvertime = item.overtime ? parseFloat(item.overtime).toFixed(2) : "";
        row.innerHTML = `
        <td><div class="date">${formattedDate}</div></td>
        <td><input type="time" class="time-start" value="${item.startTime || ""}"></td>
        <td><input type="time" class="time-end" value="${item.endTime || ""}"></td>
        <td><input type="time" class="time-start-1" value="${item.startTime1 || ""}"></td>
        <td><input type="time" class="time-end-1" value="${item.endTime1 || ""}"></td>
        <td><input type="text" class="hours-normal" value="${formattedHoursNormal || ""}" readonly></td>
        <td><input type="text" class="overtime" value="${formattedOvertime || ""}" readonly></td>
        <td><input type="text" class="comments" value="${item.comments || ""}"></td>
      `;
      }
    });
    this.updateTotalHoursMonth();
    this.updateTotalOverTimeMonth();
  }

  updateDOMWithDays(daysArray) {
    const tableBody = document.getElementById("timeSheet").querySelector("tbody");
    console.log("tableBody", tableBody);

    tableBody.innerHTML = "";
    daysArray.forEach((day) => {
      const row = tableBody.insertRow();

      let cell = row.insertCell();
      cell.innerHTML = `<div class="date">${day.date}</div>`;
      cell = row.insertCell();
      cell.innerHTML = '<input type="time" class="time-start">';
      cell = row.insertCell();
      cell.innerHTML = '<input type="time" class="time-end">';
      cell = row.insertCell();
      cell.innerHTML = '<input type="time" class="time-start-1">';
      cell = row.insertCell();
      cell.innerHTML = '<input type="time" class="time-end-1">';
      cell = row.insertCell();
      cell.innerHTML = '<input type="text" class="hours-normal" readonly>';
      cell = row.insertCell();
      cell.innerHTML = '<input type="text" class="overtime" readonly>';
      cell = row.insertCell();
      cell.innerHTML = '<input type="text" class="comments">';
    });
  }

  hideContent() {
    document.getElementById("loginForm").style.display = "block";
    document.querySelector("header").style.display = "none";
    document.querySelector("table").style.display = "none";
    document.querySelector("#animation-bg").style.display = "block";
  }

  showContent() {
    document.getElementById("loginForm").style.display = "none";
    document.querySelector("header").style.display = "block";
    document.querySelector("table").style.display = "table";
    document.querySelector("#animation-bg").style.display = "none";
  }

  updateEmployeeName() {
    const username = localStorage.getItem("username");
    const employeeName = document.getElementById("employeeName");
    if (employeeName && username) {
      employeeName.textContent = username;
    } else {
      console.error("Element or username not found");
    }
  }

  updateTotalHoursMonth() {
    const rows = document.querySelectorAll("#timeSheet tbody tr");
    let totalHoursForMonth = 0;

    rows.forEach((row) => {
      const hoursNormalInput = row.querySelector(".hours-normal");
      const hoursValue = parseFloat(hoursNormalInput.value || 0);
      totalHoursForMonth += hoursValue;
    });

    const totalHoursDisplay = document.getElementById("totalHours");
    totalHoursDisplay.textContent = totalHoursForMonth.toFixed(2);
  }

  updateTotalOverTimeMonth() {
    const rows = document.querySelectorAll("#timeSheet tbody tr");
    let totalOvertimeForMonth = 0;

    rows.forEach((row) => {
      const overTimeInput = row.querySelector(".overtime");
      const overTimeValue = parseFloat(overTimeInput.value || 0);
      totalOvertimeForMonth += overTimeValue;
    });

    const totalOverTimeDisplay = document.getElementById("totalOvertime");
    totalOverTimeDisplay.textContent = totalOvertimeForMonth.toFixed(2);
  }

  calculateWorkingHours() {
    const rows = document.getElementById("timeSheet").querySelectorAll("tbody tr");

    // Helper function for calculating the hours between two points in time
    const calculateHours = (start, end) => {
      if (!start || !end) return 0;
      const startDate = new Date(`01/01/2000 ${start}`);
      const endDate = new Date(`01/01/2000 ${end}`);
      return (endDate - startDate) / (1000 * 60 * 60);
    };

    Array.from(rows).forEach((row) => {
      const getValue = (selector) => row.querySelector(selector).value;

      const startTime = getValue(".time-start");
      const endTime = getValue(".time-end");
      const startTime1 = getValue(".time-start-1");
      const endTime1 = getValue(".time-end-1");
      const hoursNormal = row.querySelector(".hours-normal");
      const overTimeCell = row.querySelector(".overtime");

      const totalHours = calculateHours(startTime, endTime) + calculateHours(startTime1, endTime1);
      const normalWorkingHours = 8 + 24 / 60;
      const overTime = totalHours - normalWorkingHours;

      if (totalHours > 0) {
        hoursNormal.value = totalHours.toFixed(2);
        overTimeCell.value = overTime.toFixed(2);
      } else {
        hoursNormal.value = "";
        overTimeCell.value = "";
      }
    });

    this.updateTotalHoursMonth();
    this.updateTotalOverTimeMonth();
  }
}
