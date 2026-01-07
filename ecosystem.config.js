module.exports = {
  apps: [{
    name: "socket-kuotabbm",
    script: "index.js",
    exec_mode: "fork",
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
