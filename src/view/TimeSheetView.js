import { EmployeeModel } from "../model/EmployeeModel.js";
export class TimeSheetView {
  constructor(controller) {
    this.controller = controller;
    this.model = new EmployeeModel();
  }

  updateDOMWithDays(daysArray) {
    const tableBody = document.getElementById("timeSheet").querySelector("tbody");
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
    document.querySelector("section").style.display = "none";
    document.querySelector("table").style.display = "none";
    document.querySelector("footer").style.display = "none";
    document.querySelector("#animation-bg").style.display = "block";
  }

  showContent() {
    document.getElementById("loginForm").style.display = "none";
    document.querySelector("header").style.display = "block";
    document.querySelector("section").style.display = "block";
    document.querySelector("table").style.display = "table";
    document.querySelector("footer").style.display = "block";
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

  calculateWorkingHours() {
    const rows = document.getElementById("timeSheet").querySelectorAll("tbody tr");

    Array.from(rows).forEach((row) => {
      const startTime = row.querySelector(".time-start").value;
      const endTime = row.querySelector(".time-end").value;
      const startTime1 = row.querySelector(".time-start-1").value;
      const endTime1 = row.querySelector(".time-end-1").value;
      const hoursNormal = row.querySelector(".hours-normal");
      const overTimeCell = row.querySelector(".overtime");

      let totalHours = 0;
      //morning time
      if (startTime && endTime) {
        const start = new Date(`01/01/2000 ${startTime}`);
        const end = new Date(`01/01/2000 ${endTime}`);
        const diff = (end - start) / (1000 * 60 * 60);
        totalHours += diff;
      }
      if (totalHours > 0) {
        hoursNormal.value = totalHours.toFixed(2);
      } else {
        hoursNormal.value = "";
      }

      //time afternoone
      if (startTime1 && endTime1) {
        const start1 = new Date(`01/01/2000 ${startTime1}`);
        const end1 = new Date(`01/01/2000 ${endTime1}`);
        const diff1 = (end1 - start1) / (1000 * 60 * 60);
        totalHours += diff1;
      }
      if (totalHours > 0) {
        hoursNormal.value = totalHours.toFixed(2);
      } else {
        hoursNormal.value = "";
      }
      const normalWorkingHours = 8 + 24 / 60;
      let overTime;
      if (totalHours > normalWorkingHours) {
        overTime = totalHours - normalWorkingHours;
      } else {
        overTime = 0;
      }
      // hoursNormal
      if (totalHours > 0) {
        hoursNormal.value = totalHours.toFixed(2);
      } else {
        hoursNormal.value = "";
      }
      // overTimeCell
      if (overTime > 0) {
        overTimeCell.value = overTime.toFixed(2);
      } else {
        overTimeCell.value = "";
      }
    });
    this.updateTotalHoursMonth();
  }
}
