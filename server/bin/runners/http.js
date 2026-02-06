import http from 'http';

import chalk from 'chalk';

import server from '../../server.js';

export default function startServer() {
  const httpServer = http.createServer(server);
  const PORT = process.env.PORT;
  console.warn(PORT);

  httpServer.listen(PORT, () => {
    console.log(chalk.green('==============================='));
    console.log(chalk.green.bold('🚀 SERVER STARTED:') + ' HTTP server is running');
    console.log(chalk.cyan.bold('🌐 URL:') + ` http://localhost:${PORT}`);
    console.log(chalk.green('==============================='));
  });

  httpServer.on('error', err => {
    console.log(chalk.red('==============================='));
    console.log(chalk.red.bold('❌ SERVER ERROR:') + ' Failed to start HTTP server');
    console.log(chalk.yellow(`📄 ${err.message}`));
    console.log(chalk.red('==============================='));
  });
}
