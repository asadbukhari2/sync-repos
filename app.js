// app.js
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/run-sync", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sync = spawn("bash", ["./sync.sh"], {
    env: {
      ...process.env,
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

module.exports = app;
