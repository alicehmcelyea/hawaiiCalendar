const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hawaii Calendar Preview</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f4f4f4;
      padding: 2rem;
    }

    .calendar {
      max-width: 420px;
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      font-size: 0.75rem;
      color: #666;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .cell {
      aspect-ratio: 1 / 1;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6px;
      border-radius: 4px;
    }

    .price {
      font-size: 0.7rem;
      font-weight: 400;
    }

    .available { background: #6da544; }
    .booked { background: #c94444; }
    .pending { background: #e6a057; }

    .legend {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      font-size: 0.75rem;
    }

    .legend span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
  </style>
</head>

<body>

<div class="calendar">
  <div class="header">
    <span>October 2025</span>
    <span>‹ ›</span>
  </div>

  <div class="days">
    <div>MO</div><div>TU</div><div>WE</div><div>TH</div>
    <div>FR</div><div>SA</div><div>SU</div>
  </div>

  <div id="grid" class="grid"></div>

  <div class="legend">
    <span><div class="dot available"></div> Available</span>
    <span><div class="dot booked"></div> Booked</span>
    <span><div class="dot pending"></div> Pending</span>
  </div>
</div>

<script>
  const YEAR = 2025;
  const MONTH = 9; // October (0-based: Jan = 0)

  function getMondayStart(date) {
    const d = new Date(date);
    const day = d.getDay() || 7; // Sun → 7
    d.setDate(d.getDate() - (day - 1));
    return d;
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  fetch("/calendar")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("grid");
      grid.innerHTML = "";

      // Build lookup: { "YYYY-MM-DD": "available" }
      const availabilityMap = {};
      data.availability.forEach(d => {
        availabilityMap[d.date] = d.status;
      });

      const firstOfMonth = new Date(YEAR, MONTH, 1);
      const startDate = getMondayStart(firstOfMonth);

      // 6 weeks × 7 days = 42 cells
      for (let i = 0; i < 42; i++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + i);

        const cell = document.createElement("div");
        cell.className = "cell";

        const iso = formatDate(current);
        const status = availabilityMap[iso];

        if (current.getMonth() !== MONTH) {
          cell.style.opacity = "0.3";
        }

       if (status) {
  cell.classList.add(status);
  cell.innerHTML =
    "<div>" + current.getDate() + "</div>" +
    "<div class='price'>$25.00</div>";
} else {
  cell.style.background = "#e0e0e0";
  cell.innerHTML =
    "<div>" + current.getDate() + "</div>";
}
        grid.appendChild(cell);
      }
    });
</script>


</body>
</html>
  `);
});



app.get("/calendar", (req, res) => {
  res.json({
    property: "Mock Hawaii Property",
    availability: [
      { date: "2026-02-01", status: "available" },
      { date: "2026-02-02", status: "booked" },
      { date: "2026-02-03", status: "available" }
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
