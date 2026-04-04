import { setupCallbacks } from './callbacks/index.js';
import { startCommand, helpCommand, complaintsCommand } from './commands/index.js';
import { bot, connectDB } from './config/index.js';
import { setupHandlers } from './handlers/index.js';

// Підключення до БД
connectDB();

// Налаштування команд
bot.api.setMyCommands([
  { command: 'start', description: 'Запуск бота' },
  { command: 'complaints', description: 'Скарги (оператор)' },
  { command: 'contact', description: "Зв'язатися" },
  { command: 'help', description: 'Допомога' },
]);

bot.command('start', startCommand);
bot.command('help', helpCommand);
bot.command('complaints', complaintsCommand);

// Налаштування колбеків та обробників
setupCallbacks(bot);
setupHandlers(bot);

// Запуск бота
bot.start();
console.log('Бoт запущено');

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
