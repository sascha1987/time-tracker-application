import { EmployeeModel } from "../model/EmployeeModel.js";
import { TimeSheetView } from "../view/TimeSheetView.js";

export class TimeSheetController {
  constructor() {
    this.model = new EmployeeModel();
    this.view = new TimeSheetView(this);
    this.handleTimeSheetChanges = this.handleTimeSheetChanges.bind(this);
  }

  updateDays() {
    console.log("called");
    const month = parseInt(document.getElementById("monthInput").value, 10) - 1;
    const year = parseInt(document.getElementById("yearInput").value, 10);
    const daysArray = this.model.calculateDaysForMonth(year, month);
    console.log("daysArray in updateDays: ", daysArray);
    this.view.updateDOMWithDays(daysArray);
    this.fetchAndDisplayTimeSheetData();
  }

  async login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        this.view.hideContent();
        this.view.updateEmployeeName();
        this.fetchAndDisplayTimeSheetData();
        this.view.showContent();
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
  async checkAuthenticationStatus() {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        //        console.log("No token, hiding content");
        this.view.hideContent();
        return;
      }
      try {
        const response = await fetch("http://localhost:5500/verify-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log("Token valid, showing content");
          this.view.showContent();
          this.view.updateEmployeeName();
          //         this.fetchAndDisplayTimeSheetData();
        } else {
          console.log("Token invalid, hiding content");
          throw new Error("Token validation failed");
        }
      } catch (error) {
        console.error("Fehler bei der Token-Überprüfung:", error);
        localStorage.removeItem("token");
        this.view.hideContent();
      }
    }
  }
  fetchProtectedData() {
    const token = localStorage.getItem("token");
    console.log("Function fetchProtectedData token: ", token);
    fetch("http://localhost:5500/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Fehler:", error));
  }

  init() {
    //console.log("init called");
    if (typeof document !== "undefined") {
      document.getElementById("monthInput")?.addEventListener("change", () => this.updateDays());
      document.getElementById("yearInput")?.addEventListener("change", () => this.updateDays());
      document.getElementById("loginButton")?.addEventListener("click", () => this.login());
      document.getElementById("logoutButton")?.addEventListener("click", () => this.logOut());
      document.getElementById("timeSheet")?.addEventListener("change", (event) => this.handleTimeSheetChanges(event));
      this.checkAuthenticationStatus();
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
  saveTimeSheetData() {
    // console.log("saveTimeSheetData called");
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
    console.log("rows", rows);
    console.log("timeSheetData", timeSheetData);

    fetch("http://localhost:5500/save-timesheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ timeSheetData }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Data stored");
      })
      .catch((error) => {
        console.error("Error while saving data: ", error);
        alert("Error while saving data");
      });
  }
  fetchAndDisplayTimeSheetData() {
    //   console.log("fetchAndDisplayTimeSheetData called");
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5500/get-timesheet", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("timeSheet").querySelector("tbody");
        data.forEach((item) => {
          // Converting date from database to GUI format
          const dbDate = new Date(item.date);
          const formattedDate = `${dbDate.getDate().toString().padStart(2, "0")}.${(dbDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${dbDate.getFullYear()}`;

          let found = false;
          tableBody.querySelectorAll("tr").forEach((row) => {
            if (row.querySelector(".date").innerText === formattedDate) {
              row.querySelector(".time-start").value = item.startTime === "00:00:00" ? "" : item.startTime;
              row.querySelector(".time-end").value = item.endTime === "00:00:00" ? "" : item.endTime;
              row.querySelector(".time-start-1").value = item.startTime1 === "00:00:00" ? "" : item.startTime1;
              row.querySelector(".time-end-1").value = item.endTime1 === "00:00:00" ? "" : item.endTime1;
              row.querySelector(".hours-normal").value = item.hoursNormal || "";
              row.querySelector(".overtime").value = item.overtime || "";
              row.querySelector(".comments").value = item.comments || "";
              found = true;
            }
          });
        });
        this.view.updateTotalHoursMonth();
      })
      .catch((error) => {
        console.error("Error when retrieving data:", error);
      });
  }
}
