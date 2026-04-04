module.exports = {
  apps: [
    {
      name: "app",
      script: "src/app.js",
      env: {
        ENV_FILE: "/srv/pulse/.env",
        NODE_ENV: "prod",
      },
    },
  ],
};