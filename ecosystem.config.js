module.exports = {
  apps: [{
    name: 'hytaleservers',
    script: './node_modules/.bin/next',
    args: 'start -p 3003',
    cwd: '/root/hytaleservers-tech',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '3003',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3003',
      NEXT_PUBLIC_SUPABASE_URL: 'https://ncxelqwplkhlhvbmdatf.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jeGVscXdwbGtobGh2Ym1kYXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDY3NTMsImV4cCI6MjA4NDA4Mjc1M30.8P_zds-RcwFC-CdqCg6TXCCEtapcQYeYrSlB7gavp9s',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: 'sb_publishable_h4MJcTegWY2W93zWfGmkVQ_E2QSDnRH'
    },
    error_file: '/root/.pm2/logs/hytaleservers-error.log',
    out_file: '/root/.pm2/logs/hytaleservers-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
  }]
};
