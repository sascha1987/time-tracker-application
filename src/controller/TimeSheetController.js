import { EmployeeModel } from "../model/EmployeeModel.js";
import { TimeSheetView } from "../view/TimeSheetView.js";

export class TimeSheetController {
  constructor() {
    this.model = new EmployeeModel();
    this.view = new TimeSheetView(this);
    this.handleTimeSheetChanges = this.handleTimeSheetChanges.bind(this);
    this.saveTimeSheetData = this.saveTimeSheetData.bind(this);
    this.fetchAndDisplayTimeSheetData = this.fetchAndDisplayTimeSheetData.bind(this);
  }

  updateDays() {
    console.log("Updating days called");
    const month = parseInt(document.getElementById("monthInput").value, 10) - 1;
    const year = parseInt(document.getElementById("yearInput").value, 10);
    this.fetchAndDisplayTimeSheetData(month, year);
    const daysArray = this.model.calculateDaysForMonth(year, month);
    this.view.updateDOMWithDays(daysArray);
  }

  async login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
      const data = await this.model.login(username, password);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        this.view.hideContent();
        this.view.updateEmployeeName();
        await this.fetchAndDisplayTimeSheetData();
        this.view.showContent();
        this.init();
      } else {
        alert("Login fehlgeschlagen");
      }
    } catch (error) {
      console.error("Fehler beim Login:", error);
    }
  }

  logOut() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  async verifyUserAuthentication() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.view.hideContent();
      return;
    }
    try {
      const isValid = await this.model.validateToken(token);
      if (isValid) {
        this.view.showContent();
        this.view.updateEmployeeName();
      } else {
        throw new Error("Token validation failed");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem("token");
      this.view.hideContent();
    }
  }

  init() {
    if (typeof document !== "undefined") {
      document.getElementById("monthInput")?.addEventListener("change", () => this.updateDays());
      document.getElementById("yearInput")?.addEventListener("change", () => this.updateDays());
      document.getElementById("loginButton")?.addEventListener("click", () => this.login());
      document.getElementById("logoutButton")?.addEventListener("click", () => this.logOut());
      document.getElementById("timeSheet")?.addEventListener("change", (event) => this.handleTimeSheetChanges(event));
      this.verifyUserAuthentication();
      const date = new Date();
      document.getElementById("monthInput").value = date.getMonth() + 1;
      document.getElementById("yearInput").value = date.getFullYear();
      this.updateDays();

      document.getElementById("saveButton")?.addEventListener("click", this.saveTimeSheetData);
      document.getElementById("exportPdfButton").addEventListener("click", () => this.generatePDF());
    }
  }

  handleTimeSheetChanges(event) {
    if (
      event.target.classList.contains("time-start") ||
      event.target.classList.contains("time-end") ||
      event.target.classList.contains("time-start-1") ||
      event.target.classList.contains("time-end-1")
    ) {
      this.view.calculateWorkingHours();
    }
  }
  async saveTimeSheetData() {
    try {
      const token = localStorage.getItem("token");
      const rows = document.getElementById("timeSheet").querySelectorAll("tbody tr");
      const timeSheetData = Array.from(rows).map((row) => ({
        date: row.querySelector(".date").innerText,
        startTime: row.querySelector(".time-start").value,
        endTime: row.querySelector(".time-end").value,
        startTime1: row.querySelector(".time-start-1").value,
        endTime1: row.querySelector(".time-end-1").value,
        hoursNormal: row.querySelector(".hours-normal").value,
        overtime: row.querySelector(".overtime").value,
        comments: row.querySelector(".comments").value,
      }));

      await this.model.saveTimeSheetData(timeSheetData, token);
      alert("Data stored");
    } catch (error) {
      console.error("Error while saving data: ", error);
      alert("Error while saving data");
    }
  }

  async fetchAndDisplayTimeSheetData(month, year) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const data = await this.model.fetchTimeSheetData(token, month, year);
      // Check if for the given month we have data in db
      // if not call calculateDaysForMonth
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === month && itemDate.getFullYear() === year;
      });

      if (filteredData.length > 0) {
        this.view.displayTimeSheetData(filteredData, month, year);
      } else {
        const daysArray = this.model.calculateDaysForMonth(year, month);
        this.view.updateDOMWithDays(daysArray);
      }
    } catch (error) {
      console.error("Error when retrieving data:", error);
    }
  }
  generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    //space between columns
    const columnWidths = [30, 20, 20, 20, 20, 20, 20, 50];

    // Set positions of column headers
    const headers = ["Date", "Start", "End", "Start", "End", "Hours", "Overtime", "Comments"];
    let xPosition = 10; // Start position for the first column

    // Header
    headers.forEach((header, index) => {
      doc.text(header, xPosition, 10);
      xPosition += columnWidths[index];
    });

    const rows = document.querySelectorAll("#timeSheet tbody tr");
    let yPosition = 20; // Start position for the first line of data

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      xPosition = 10;
      cells.forEach((cell, index) => {
        let cellText = cell.querySelector("input") ? cell.querySelector("input").value : cell.textContent.trim();
        doc.text(cellText, xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 5; // Increasing the y-position for the next line
    });
    yPosition += 10;

    const totalHours = document.getElementById("totalHours").textContent;
    const totalOvertime = document.getElementById("totalOvertime").textContent;
    const employeeName = document.getElementById("employeeName").textContent;

    doc.text(`Total Hours: ${totalHours}`, 10, yPosition);
    doc.text(`Total Overtime: ${totalOvertime}`, 10, yPosition + 10);
    doc.text(`Name: ${employeeName}`, 10, yPosition + 20);

    doc.save("timesheet.pdf");
  }
}
