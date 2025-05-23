module.exports = {
  apps: [
    {
      name: "hireme",
      script: "./node_modules/next/dist/bin/next", // Directly reference the JS file
      args: "start",
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 80,
        NODE_ENV: "production",
      },
    },
  ],
};