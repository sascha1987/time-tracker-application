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

function updateDOMWithDays(year, month) {
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
