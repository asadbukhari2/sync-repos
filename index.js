// server.js
const cluster = require("cluster");
const os = require("os");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🧠 Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
  });
}
