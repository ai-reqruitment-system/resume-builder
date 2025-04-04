module.exports = {
  apps: [{
    name: 'vuexy-nextjs-admin',
    script: 'npm',
    args: 'start',
    env: {
      PORT: 5010,
      NODE_ENV: 'production'
    }
  }]
}
