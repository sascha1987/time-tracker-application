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
    //    console.log("Updating days for month:", month + 1, "and year:", year);
    this.fetchAndDisplayTimeSheetData(month, year);
    const daysArray = this.model.calculateDaysForMonth(year, month);
    this.view.updateDOMWithDays(daysArray);
  }

  async login() {
    // console.log("login called");
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
  // fetchProtectedData() {
  //   const token = localStorage.getItem("token");
  //   fetch("http://localhost:5500/protected", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => console.log(data))
  //     .catch((error) => console.error("Fehler:", error));
  // }

  init() {
    // console.log("init called");
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

      //    this.view.displayTimeSheetData(data, month, year);
    } catch (error) {
      console.error("Error when retrieving data:", error);
    }
  }
}
