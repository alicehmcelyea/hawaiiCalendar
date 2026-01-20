const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hawaii Calendar Preview</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; }
          .available { color: green; }
          .booked { color: red; }
        </style>
      </head>
      <body>
        <h1>Hawaii Calendar (Render Preview)</h1>
        <div id="calendar">Loading…</div>

        <script>
          fetch("/calendar")
            .then(res => res.json())
            .then(data => {
              const el = document.getElementById("calendar");
              el.innerHTML = data.availability
                .map(d => 
                  \`<div class="\${d.status}">
                    \${d.date}: \${d.status}
                  </div>\`
                )
                .join("");
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
