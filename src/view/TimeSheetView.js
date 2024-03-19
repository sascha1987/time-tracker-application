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

function updateDays() {
  const month = parseInt(document.getElementById("monthInput").value, 10) - 1;
  const year = parseInt(document.getElementById("yearInput").value, 10);
  updateDOMWithDays(year, month);
}

export function init() {
  if (typeof document !== "undefined") {
    document.getElementById("monthInput").addEventListener("change", updateDays);
    document.getElementById("yearInput").addEventListener("change", updateDays);

    document.getElementById("timeSheet").addEventListener("change", (event) => {
      if (
        event.target.classList.contains("time-start") ||
        event.target.classList.contains("time-end") ||
        event.target.classList.contains("time-start-1") ||
        event.target.classList.contains("time-end-1")
      ) {
        calculateWorkingHours();
      }
    });

    const date = new Date();
    document.getElementById("monthInput").value = date.getMonth() + 1;
    document.getElementById("yearInput").value = date.getFullYear();
    updateDays();
  }

  const date = new Date();
  document.getElementById("monthInput").value = date.getMonth() + 1;
  document.getElementById("yearInput").value = date.getFullYear();
  updateDays();
}

function calculateWorkingHours() {
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
      console.log("total: ", totalHours);
      console.log("diff: ", diff);
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
      console.log("total: ", totalHours);
      console.log("diff1: ", diff1);
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
    if (totalHours < 0) {
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
