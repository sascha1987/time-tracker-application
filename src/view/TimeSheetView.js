//create line for every day in a month
function createDaysForMonth(year, month) {
  const tableBody = document.getElementById("timeSheet").querySelector("tbody");
  tableBody.innerHTML = ""; //----> delete lines if there are any

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  console.log("daysInMonth ", daysInMonth);

  for (let day = 1; day <= daysInMonth; day++) {
    //--> Do I need this?!    const date = new Date(year, month, day);
    const formattedDate = `${day.toString().padStart(2, "0")}.${(month + 1)
      .toString()
      .padStart(2, "0")}.${year}`;
    console.log("formattedDate ", formattedDate);

    const row = tableBody.insertRow();

    // date
    let cell = row.insertCell();
    console.log("cell ", cell);
    cell.innerHTML = `<div class="date">${formattedDate}</div>`;

    // start
    cell = row.insertCell();
    cell.innerHTML = '<input type="time" class="time-start">';

    // end
    cell = row.insertCell();
    cell.innerHTML = '<input type="time" class="time-end">';

    // start
    cell = row.insertCell();
    cell.innerHTML = '<input type="time" class="time-start-1">';

    // end
    cell = row.insertCell();
    cell.innerHTML = '<input type="time" class="time-end-1">';

    // working hours
    cell = row.insertCell();
    cell.innerHTML = '<input type="text" class="hours-normal" readonly>';

    // overtime
    cell = row.insertCell();
    cell.innerHTML = '<input type="text" class="overtime" readonly>';

    // comment section
    cell = row.insertCell();
    cell.innerHTML = '<input type="text" class="comments">';
  }
}

document.getElementById("monthInput").addEventListener("change", function () {
  updateDays();
});

document.getElementById("yearInput").addEventListener("change", function () {
  updateDays();
});

function updateDays() {
  const month = parseInt(document.getElementById("monthInput").value, 10) - 1; // -1 because month start at 0
  const year = parseInt(document.getElementById("yearInput").value, 10); // @TODO Delete Comment
  createDaysForMonth(year, month);
}

function init() {
  const date = new Date();
  document.getElementById("monthInput").value = date.getMonth() + 1; // +1 because month start at 0
  document.getElementById("yearInput").value = date.getFullYear(); // @TODO Delete Comment
  updateDays();
}
init();
