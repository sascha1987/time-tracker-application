export function calculateDaysForMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${day.toString().padStart(2, "0")}.${(month + 1)
      .toString()
      .padStart(2, "0")}.${year}`;
    daysArray.push({ date: formattedDate });
  }
  return daysArray;
}
export function updateDOMWithDays(year, month) {
  const tableBody = document.getElementById("timeSheet").querySelector("tbody");
  tableBody.innerHTML = "";

  const daysArray = calculateDaysForMonth(year, month);

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

function checkAuthenticationStatus() {
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
      hideContent();
      return;
    }

    fetch("http://localhost:5500/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          showContent();
        } else {
          localStorage.removeItem("token");
          hideContent();
        }
      })
      .catch((error) => {
        console.error("Fehler bei der Token-Überprüfung:", error);
        hideContent();
      });
  }
}

function updateDays() {
  const month = parseInt(document.getElementById("monthInput").value, 10) - 1;
  const year = parseInt(document.getElementById("yearInput").value, 10);
  updateDOMWithDays(year, month);
}

export function calculateWorkingHours() {
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
}

function hideContent() {
  document.getElementById("loginForm").style.display = "block";
  document.querySelector("header").style.display = "none";
  document.querySelector("section").style.display = "none";
  document.querySelector("table").style.display = "none";
  document.querySelector("footer").style.display = "none";
}

function showContent() {
  document.getElementById("loginForm").style.display = "none";
  document.querySelector("header").style.display = "block";
  document.querySelector("section").style.display = "block";
  document.querySelector("table").style.display = "table";
  document.querySelector("footer").style.display = "block";
}

function login() {
  let username = document.getElementById("username").value;
  console.log(username);
  let password = document.getElementById("password").value;
  console.log(password);

  fetch("http://localhost:5500/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data: ", data);
      if (data.success) {
        localStorage.setItem("token", data.token);
        console.log("data", data);
        document.getElementById("loginForm").style.display = "none";
        showContent();
        fetchProtectedData();
        init();
      } else {
        console.log("else block");
        alert("Login fehlgeschlagen");
      }
    })
    .catch((error) => {
      console.error("Fehler beim Login:", error);
    });
}

function fetchProtectedData() {
  console.log("Function fetchProtectedData called");
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

export function init() {
  if (typeof document !== "undefined") {
    document.getElementById("monthInput")?.addEventListener("change", () => updateDays());
    document.getElementById("yearInput")?.addEventListener("change", () => updateDays());
    document.getElementById("loginButton")?.addEventListener("click", login);
    document.getElementById("timeSheet")?.addEventListener("change", handleTimeSheetChanges);

    checkAuthenticationStatus();

    const date = new Date();
    document.getElementById("monthInput").value = date.getMonth() + 1;
    document.getElementById("yearInput").value = date.getFullYear();
    updateDays();
    document.getElementById("saveButton")?.addEventListener("click", saveTimeSheetData);
  }
}

function handleTimeSheetChanges(event) {
  if (
    event.target.classList.contains("time-start") ||
    event.target.classList.contains("time-end") ||
    event.target.classList.contains("time-start-1") ||
    event.target.classList.contains("time-end-1")
  ) {
    calculateWorkingHours();
  }
}

function saveTimeSheetData() {
  const rows = document.getElementById("timeSheet");
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

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}
