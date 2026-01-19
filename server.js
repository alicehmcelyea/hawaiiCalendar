const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

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
