module.exports = {
  apps: [
    {
      name: 'multiprofile',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: 'C:\\MultiProfile', // Use double backslashes for Windows paths
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
      // Remove any problematic startup scripts or commands
      // interpreter: 'none' // Try adding this
    },
  ],
};