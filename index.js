const express = require("express");
const { spawn } = require("child_process");
const app = express();
const PORT = 3000;
require("dotenv").config();

app.use(express.static("public"));

app.get("/run-sync", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sync = spawn("bash", ["./sync.sh"], {
    env: {
      BITBUCKET_REPO: process.env.BITBUCKET_REPO,
      GITHUB_REPO: process.env.GITHUB_REPO,
    },
  });

  sync.stdout.on("data", (data) => {
    res.write(`data: [stdout] ${data.toString().trim()}\n\n`);
  });

  sync.stderr.on("data", (data) => {
    res.write(`data: [stderr] ${data.toString().trim()}\n\n`);
  });

  sync.on("close", (code) => {
    res.write(`data: === Script finished with exit code ${code} ===\n\n`);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
