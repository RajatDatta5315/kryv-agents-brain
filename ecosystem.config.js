module.exports = {
  apps: [{
    name: 'kryv-agents',
    script: 'agents.js',
    watch: false,
    restart_delay: 10000,
    max_restarts: 20,
    env: { NODE_ENV: 'production', PORT: 3002 }
  }]
};
