module.exports = {
  apps: [
    {
      name: 'haatpoint',
      script: 'artisan',
      args: 'serve --host=0.0.0.0 --port=8000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      interpreter: 'php',
      interpreter_args: '',
      env: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        APP_DEBUG: false,
        APP_URL: 'https://www.haatpoint.com'
      },
      error_file: '/var/www/haatpoint/storage/logs/pm2-error.log',
      out_file: '/var/www/haatpoint/storage/logs/pm2-out.log',
      log_file: '/var/www/haatpoint/storage/logs/pm2-combined.log',
      time: true
    }
  ]
};
