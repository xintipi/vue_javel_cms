module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace: './dist',
      keepWorkspace: false,
      repositoryUrl: '', // Skip fetching repo
      ignores: ['.git', 'node_modules', 'deploy'],
      deleteOnRollback: true,
      shallowClone: false
    },
    testing: {
      deployTo: '/var/www/Newphoria_Applican_CMS',
      servers: 'root@103.68.68.166:4122',
      build: 'npm run build:testing',
    },
    production: {
      deployTo: '/var/www/html/laravel-cms',
      servers: 'gumi-tu@52.156.58.81',
      build: 'npm run build:production',
    }
  })

  shipit.blTask('deploy:build', async () => {
    await shipit.local(shipit.config.build);
  })

  shipit.on('deploy', async () => {
    await shipit.start(['deploy:build']);
  })
}
