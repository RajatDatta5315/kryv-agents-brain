module.exports = {
  apps: [{
    name: 'kryv-agents',
    script: 'server.js',
    watch: false,
    autorestart: true,
    restart_delay: 5000,
    max_restarts: 50,
    env: { NODE_ENV: 'production', PORT: 3002 }
  }]
};
