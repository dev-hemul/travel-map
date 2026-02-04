import { Bot, InlineKeyboard } from 'grammy';
import mongoose from 'mongoose';

import Support from '../model/Support.js';
import 'dotenv/config';

const DB_URL = process.env.DB_URL;
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_ADMIN_ID = Number(process.env.BOT_ADMIN_ID);
const GROUP_ID = process.env.GROUP_ID;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN не встановлено');
if (!BOT_ADMIN_ID) throw new Error('BOT_ADMIN_ID не встановлено');
if (!DB_URL) throw new Error('DB_URL не встановлено');
if (!GROUP_ID) throw new Error('GROUP_ID не встановлено');

mongoose
  .connect(DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const bot = new Bot(BOT_TOKEN);
const userState = {};
const operatorChats = {};
const activeComplaints = {};
const COOLDOWN_MS = 5 * 60 * 1000;
const lastComplaintTime = {};
const queue = [];
const assignedOperators = {};

bot.api.setMyCommands([
  { command: 'start', description: 'Запуск бота' },
  { command: 'complaints', description: 'Скарги (оператор)' },
  { command: 'contact', description: "Зв'язатися" },
  { command: 'help', description: 'Допомога' },
]);

// Команди
bot.command('start', async ctx => {
  await ctx.reply('Привіт! Я бот підтримки, чим можу допомогти?', {
    reply_markup: new InlineKeyboard()
      .text('📝 Відправити скаргу', 'send_complaint')
      .row()
      .text("📞 Зв'язатися з оператором", 'contact_operator'),
  });
});

bot.command('help', async ctx => {
  await ctx.reply(`Команди бота:
/start — Запуск бота
/complaints — Скарги (оператор)
/contact — Зв'язатися з оператором
/help — Допомога`);
});

bot.command('complaints', async ctx => {
  if (ctx.from.id !== BOT_ADMIN_ID) return ctx.reply('Тільки для оператора.');
  const complaints = await Support.find({ status: 'pending' }).sort({ date: -1 }).limit(5);
  if (complaints.length === 0) return ctx.reply('Немає нових скарг.');

  for (const c of complaints) {
    const operatorInfo = assignedOperators[c._id]
      ? `👤 Займається: ${assignedOperators[c._id].operatorName}`
      : '👤 Займається: ❌ Ніхто';
    const text = `📬 Нова скарга:\n\n📌 Тема: ${c.subject}\n👤 Від: ${c.name || 'користувача'}${c.username ? ` (@${c.username})` : ''}\n🆔 ID: ${c.userId}\n${operatorInfo}\n📅 Дата: ${c.date.toLocaleString()}`;
    activeComplaints[c._id] = { userId: c.userId, complaintId: c._id };

    const keyboard = new InlineKeyboard();
    if (assignedOperators[c._id] && assignedOperators[c._id].operatorId === ctx.from.id) {
      keyboard.text('💬 Чат', `start_chat_${c._id}`).row().text('✅ Вирішити', `resolve_${c._id}`);
    } else if (!assignedOperators[c._id]) {
      keyboard
        .text('Взяти в роботу', `take_complaint_${c._id}`)
        .row()
        .text('💬 Чат', `start_chat_${c._id}`)
        .row()
        .text('✅ Вирішити', `resolve_${c._id}`);
    } else {
      keyboard.text('💬 Чат', `start_chat_${c._id}`);
    }
    await ctx.reply(text, { reply_markup: keyboard });
  }
});

// Callback-и
bot.callbackQuery('cancel', async ctx => {
  const userId = ctx.from.id;
  delete userState[userId];
  if (operatorChats[userId]) delete operatorChats[userId];
  await ctx.reply('Дію скасовано.', { reply_markup: { remove_keyboard: true } });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('send_complaint', async ctx => {
  const userId = ctx.from.id;
  const lastTime = lastComplaintTime[userId] || 0;
  const now = Date.now();
  if (now - lastTime < COOLDOWN_MS) {
    const waitSec = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
    await ctx.reply(`Зачекайте ${waitSec} секунд перед наступною скаргою.`);
    return;
  }
  userState[userId] = { step: 'choose_category', data: {} };
  await ctx.reply('Оберіть тип проблеми:', {
    reply_markup: new InlineKeyboard()
      .text('🧍 Профіль', 'cat_profile')
      .row()
      .text('📍 Мітки', 'cat_marker')
      .row()
      .text('👥 Друзі', 'cat_friends')
      .row()
      .text('📝 Інше', 'cat_other')
      .row()
      .text('❌ Скасувати', 'cancel'),
  });
  await ctx.answerCallbackQuery();
});

// Оператор бере скаргу
bot.callbackQuery(/^take_complaint_(.+)$/, async ctx => {
  const complaintId = ctx.match[1];
  const operatorId = ctx.from.id;
  const operatorName = ctx.from.first_name || 'Оператор';

  if (assignedOperators[complaintId]) {
    await ctx.answerCallbackQuery({
      text: `Цей репорт вже займає ${assignedOperators[complaintId].operatorName}`,
    });
    return;
  }

  assignedOperators[complaintId] = { operatorId, operatorName, assignedAt: new Date() };
  await Support.findByIdAndUpdate(complaintId, { status: 'in_progress' });

  try {
    const complaint = await Support.findById(complaintId);
    if (complaint && complaint.messageId) {
      await bot.api.editMessageText(
        GROUP_ID,
        complaint.messageId,
        `🟡 СКАРГА #${complaintId} (В РОБОТІ):\n\n📌 Тема: ${complaint.subject}\n👤 Від: ${complaint.name || 'користувача'}${complaint.username ? ` (@${complaint.username})` : ''}\n🆔 ID: ${complaint.userId}\n👤 Займається: 🔵 ${operatorName}\n📅 Дата: ${complaint.date.toLocaleString()}\n⏱️ Взято: ${new Date().toLocaleString()}\n\n✉️ Повідомлення:\n${complaint.message}`,
        {
          reply_markup: new InlineKeyboard()
            .text('💬 Чат', `start_chat_from_group_${complaintId}`)
            .text('✅ Вирішити', `resolve_group_${complaintId}`),
        }
      );
    }
  } catch (error) {
    console.error('Помилка оновлення в групі:', error);
  }

  await ctx.answerCallbackQuery({ text: 'Ви взяли цей репорт у роботу' });

  try {
    const complaint = await Support.findById(complaintId);
    if (complaint) {
      await bot.api.sendMessage(
        operatorId,
        `🟡 Ви взяли скаргу #${complaintId}:\n\n📌 Тема: ${complaint.subject}\n👤 Від: ${complaint.name || 'користувача'}${complaint.username ? ` (@${complaint.username})` : ''}\n🆔 ID: ${complaint.userId}\n📅 Дата: ${complaint.date.toLocaleString()}\n\n✉️ Повідомлення:\n${complaint.message}`,
        {
          reply_markup: new InlineKeyboard()
            .text('💬 Чат', `start_chat_${complaintId}`)
            .row()
            .text('✅ Вирішити', `resolve_${complaintId}`),
        }
      );
    }
  } catch (error) {
    console.error('Не вдалося відправити оператору:', error);
  }

  try {
    const complaintData = activeComplaints[complaintId];
    if (complaintData) {
      await bot.api.sendMessage(
        complaintData.userId,
        `👤 Оператор ${operatorName} взяв вашу скаргу #${complaintId} у роботу.`
      );
    }
  } catch (error) {
    console.error('Не вдалося повідомити користувача:', error);
  }
});

// Чат з групи
bot.callbackQuery(/^start_chat_from_group_(.+)$/, async ctx => {
  const complaintId = ctx.match[1];
  const operatorId = ctx.from.id;
  const operatorName = ctx.from.first_name || 'Оператор';

  const complaint = await Support.findById(complaintId);
  if (!complaint || (complaint.status !== 'pending' && complaint.status !== 'in_progress')) {
    await ctx.answerCallbackQuery({ text: 'Скарга не знайдена або вирішена' });
    return;
  }

  if (!assignedOperators[complaintId]) {
    assignedOperators[complaintId] = { operatorId, operatorName, assignedAt: new Date() };
    await Support.findByIdAndUpdate(complaintId, { status: 'in_progress' });

    try {
      if (complaint.messageId) {
        await bot.api.editMessageText(
          GROUP_ID,
          complaint.messageId,
          `🟡 СКАРГА #${complaintId} (В РОБОТІ):\n\n📌 Тема: ${complaint.subject}\n👤 Від: ${complaint.name || 'користувача'}${complaint.username ? ` (@${complaint.username})` : ''}\n🆔 ID: ${complaint.userId}\n👤 Займається: 🔵 ${operatorName}\n📅 Дата: ${complaint.date.toLocaleString()}\n⏱️ Взято: ${new Date().toLocaleString()}\n\n✉️ Повідомлення:\n${complaint.message}`,
          {
            reply_markup: new InlineKeyboard()
              .text('💬 Чат', `start_chat_from_group_${complaintId}`)
              .text('✅ Вирішити', `resolve_group_${complaintId}`),
          }
        );
      }
    } catch (error) {
      console.error('Помилка оновлення в групі:', error);
    }
  }

  try {
    await bot.api.sendMessage(
      operatorId,
      `🟡 Перехід до чату по скарзі #${complaintId}:\n\n📌 Тема: ${complaint.subject}\n👤 Від: ${complaint.name || 'користувача'}${complaint.username ? ` (@${complaint.username})` : ''}\n🆔 ID: ${complaint.userId}\n📅 Дата: ${complaint.date.toLocaleString()}\n\n✉️ Повідомлення:\n${complaint.message}`,
      {
        reply_markup: new InlineKeyboard()
          .text('💬 Почати чат', `start_chat_${complaintId}`)
          .row()
          .text('✅ Вирішити', `resolve_${complaintId}`),
      }
    );
    await ctx.answerCallbackQuery({ text: 'Перехід до приватного чату з ботом' });
  } catch (error) {
    console.error('Не вдалося відправити оператору:', error);
    await ctx.answerCallbackQuery({ text: 'Помилка. Спробуйте пізніше.' });
  }
});

// Початок чату
bot.callbackQuery(/^start_chat_(.+)$/, async ctx => {
  const complaintId = ctx.match[1];
  const operatorId = ctx.from.id;
  const operatorName = ctx.from.first_name || 'Оператор';

  let complaintData = activeComplaints[complaintId];
  if (!complaintData) {
    const complaint = await Support.findById(complaintId);
    if (!complaint || (complaint.status !== 'pending' && complaint.status !== 'in_progress')) {
      await ctx.answerCallbackQuery({ text: 'Скарга не знайдена або вирішена' });
      return;
    }
    complaintData = { userId: complaint.userId, complaintId: complaint._id };
    activeComplaints[complaintId] = complaintData;
  }

  if (!assignedOperators[complaintId]) {
    assignedOperators[complaintId] = { operatorId, operatorName, assignedAt: new Date() };
    await Support.findByIdAndUpdate(complaintId, { status: 'in_progress' });

    try {
      const complaint = await Support.findById(complaintId);
      if (complaint && complaint.messageId) {
        await bot.api.editMessageText(
          GROUP_ID,
          complaint.messageId,
          `🟡 СКАРГА #${complaintId} (В РОБОТІ):\n\n📌 Тема: ${complaint.subject}\n👤 Від: ${complaint.name || 'користувача'}${complaint.username ? ` (@${complaint.username})` : ''}\n🆔 ID: ${complaint.userId}\n👤 Займається: 🔵 ${operatorName}\n📅 Дата: ${complaint.date.toLocaleString()}\n⏱️ Взято: ${new Date().toLocaleString()}\n\n✉️ Повідомлення:\n${complaint.message}`,
          {
            reply_markup: new InlineKeyboard()
              .text('💬 Чат', `start_chat_from_group_${complaintId}`)
              .text('✅ Вирішити', `resolve_group_${complaintId}`),
          }
        );
      }
    } catch (error) {
      console.error('Помилка оновлення в групі:', error);
    }
  }

  operatorChats[operatorId] = complaintData.userId;
  operatorChats[complaintData.userId] = operatorId;
  userState[operatorId] = { step: 'replying', targetUserId: complaintData.userId };

  try {
    await bot.api.sendMessage(
      complaintData.userId,
      `💬 Оператор ${operatorName} приєднався до чату по скарзі #${complaintId}.`
    );
  } catch (e) {
    console.log('Не вдалося повідомити користувача:', e.message);
  }

  await ctx.reply(
    `💬 Чат з користувачем ${complaintData.userId} по скарзі #${complaintId}.\n\nТепер ви можете спілкуватися тут.`,
    { reply_markup: new InlineKeyboard().text('✅ Завершити чат', `end_chat_${complaintId}`) }
  );

  try {
    await ctx.deleteMessage();
  } catch (e) {
    console.log('Не вдалося видалити повідомлення:', e.message);
  }
  await ctx.answerCallbackQuery();
});

// Вирішення скарги
bot.callbackQuery(/^resolve_(.+)$/, async ctx => {
  const complaintId = ctx.match[1];
  const operatorId = ctx.from.id;
  const operatorName = ctx.from.first_name || 'Оператор';

  if (assignedOperators[complaintId] && assignedOperators[complaintId].operatorId !== operatorId) {
    await ctx.answerCallbackQuery({
      text: `Цю скаргу займає ${assignedOperators[complaintId].operatorName}. Тільки він може її вирішити.`,
    });
    return;
  }

  await handleResolveComplaint(ctx, complaintId, operatorName);
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(/^resolve_group_(.+)$/, async ctx => {
  const complaintId = ctx.match[1];
  const operatorId = ctx.from.id;
  const operatorName = ctx.from.first_name || 'Оператор';

  if (assignedOperators[complaintId] && assignedOperators[complaintId].operatorId !== operatorId) {
    await ctx.answerCallbackQuery({
      text: `Цю скаргу займає ${assignedOperators[complaintId].operatorName}. Тільки він може її вирішити.`,
    });
    return;
  }

  await handleResolveComplaint(ctx, complaintId, operatorName);
  await ctx.answerCallbackQuery();
});

async function handleResolveComplaint(ctx, complaintId, operatorName) {
  await Support.findByIdAndUpdate(complaintId, {
    status: 'resolved',
    resolvedBy: operatorName,
    resolvedAt: new Date(),
  });

  if (activeComplaints[complaintId]) {
    const complaintData = activeComplaints[complaintId];
    delete activeComplaints[complaintId];
    try {
      await bot.api.sendMessage(
        complaintData.userId,
        `✅ Ваша скарга #${complaintId} вирішена оператором ${operatorName}.`
      );
    } catch (e) {
      console.log('Не вдалось повідомити користувача:', e.message);
    }
  }

  delete assignedOperators[complaintId];

  try {
    const complaint = await Support.findById(complaintId);
    if (complaint && complaint.messageId) {
      await bot.api.editMessageText(
        GROUP_ID,
        complaint.messageId,
        `✅ СКАРГА #${complaintId} ВИРІШЕНА:\n\n📌 Тема: ${complaint.subject}\n👤 Від: ${complaint.name || 'користувача'}${complaint.username ? ` (@${complaint.username})` : ''}\n🆔 ID: ${complaint.userId}\n👤 Вирішив: ${operatorName}\n📅 Створено: ${complaint.date.toLocaleString()}\n📅 Вирішено: ${new Date().toLocaleString()}\n\n✉️ Повідомлення:\n${complaint.message}`,
        { reply_markup: new InlineKeyboard() }
      );
    }
  } catch (error) {
    console.error('Помилка оновлення в групі:', error);
  }

  await ctx.reply('Скаргу позначено як вирішену.');
  try {
    await ctx.deleteMessage();
  } catch (e) {
    console.log('Не вдалося видалити повідомлення:', e.message);
  }
}

// Категорії скарг
bot.callbackQuery(/^cat_/, async ctx => {
  const userId = ctx.from.id;
  const state = userState[userId];
  if (!state || state.step !== 'choose_category') {
    await ctx.reply('Почніть спочатку командою /start');
    return;
  }
  const choice = ctx.callbackQuery.data.split('_')[1];
  const typeMap = {
    profile: 'Проблема з профілем',
    marker: 'Проблема з мітками',
    friends: 'Проблема з друзями',
    other: 'Інша проблема',
  };

  if (choice === 'other') {
    state.step = 'waiting_text';
    await ctx.reply('Опишіть свою проблему детальніше');
    return;
  }

  await saveComplaintAndNotify(ctx, typeMap[choice], typeMap[choice]);
  lastComplaintTime[userId] = Date.now();
  delete userState[userId];
  await ctx.answerCallbackQuery();
});

// Обробка повідомлень
bot.on('message:text', async ctx => {
  const userId = ctx.from.id;
  const state = userState[userId];

  if (state && state.step === 'waiting_text') {
    await saveComplaintAndNotify(ctx, 'Інша проблема', ctx.message.text);
    lastComplaintTime[userId] = Date.now();
    delete userState[userId];
    return;
  }

  if (userId === BOT_ADMIN_ID && state && state.step === 'replying') {
    const text = ctx.message.text;
    try {
      await bot.api.sendMessage(state.targetUserId, `📩 Відповідь від оператора:\n\n${text}`);
      await ctx.reply('Повідомлення відправлено користувачу.');
    } catch {
      await ctx.reply('Не вдалося відправити повідомлення користувачу.');
    }
    return;
  }

  if (operatorChats[userId]) {
    const targetUserId = operatorChats[userId];
    try {
      await bot.api.sendMessage(targetUserId, `📩 Оператор: ${ctx.message.text}`);
      await ctx.reply('✅ Повідомлення відправлено користувачу.');
    } catch {
      await ctx.reply('Не вдалося надіслати повідомлення користувачу.');
    }
    return;
  }

  if (operatorChats[userId]) {
    try {
      await bot.api.sendMessage(
        operatorChats[userId],
        `📞 Користувач (ID: ${userId}): ${ctx.message.text}`
      );
      await ctx.reply('✅ Ваше повідомлення надіслано оператору.');
    } catch {
      await ctx.reply('Не вдалося надіслати повідомлення оператору.');
    }
    return;
  }
});

// Збереження скарги
async function saveComplaintAndNotify(ctx, subject, message = '') {
  try {
    const finalMessage = message || subject;
    const complaint = new Support({
      userId: ctx.from.id,
      username: ctx.from.username || '',
      name: ctx.from.first_name || 'Користувач',
      subject: subject,
      message: finalMessage,
    });

    const savedComplaint = await complaint.save();
    activeComplaints[savedComplaint._id] = { userId: ctx.from.id, complaintId: savedComplaint._id };

    await ctx.reply('Дякуємо! Ваше повідомлення передано оператору ✅', {
      reply_markup: { remove_keyboard: true },
    });

    const groupMessage = `📬 НОВА СКАРГА #${savedComplaint._id}:\n\n📌 Тема: ${subject}\n👤 Від: ${ctx.from.first_name}${ctx.from.username ? ` (@${ctx.from.username})` : ''}\n🆔 ID: ${ctx.from.id}\n👤 Займається: 🔴 ОЧІКУЄ\n📅 Дата: ${new Date().toLocaleString()}\n\n✉️ Повідомлення:\n${finalMessage}`;

    try {
      const sentMessage = await bot.api.sendMessage(GROUP_ID, groupMessage, {
        reply_markup: new InlineKeyboard()
          .text('Взяти в роботу', `take_complaint_${savedComplaint._id}`)
          .text('Вирішити', `resolve_group_${savedComplaint._id}`),
      });
      savedComplaint.messageId = sentMessage.message_id;
      await savedComplaint.save();
    } catch (error) {
      console.error('Не вдалося відправити в групу:', error);
    }

    const adminMessage = `📬 Нова скарга #${savedComplaint._id}:\n\n📌 Тема: ${subject}\n👤 Від: ${ctx.from.first_name}${ctx.from.username ? ` (@${ctx.from.username})` : ''}\n🆔 ID: ${ctx.from.id}\n\n✉️ Повідомлення:\n${finalMessage}`;

    await bot.api.sendMessage(BOT_ADMIN_ID, adminMessage, {
      reply_markup: new InlineKeyboard()
        .text('Взяти в роботу', `take_complaint_${savedComplaint._id}`)
        .row()
        .text('💬 Чат', `start_chat_${savedComplaint._id}`)
        .row()
        .text('✅ Вирішити', `resolve_${savedComplaint._id}`),
    });
  } catch (e) {
    console.error('Помилка збереження скарги:', e);
    await ctx.reply('Виникла помилка. Спробуйте пізніше.');
  }
}

// Завершення чату
bot.callbackQuery(/^end_chat_(.+)$/, async ctx => {
  const operatorId = ctx.from.id;

  if (operatorChats[operatorId]) {
    const targetUserId = operatorChats[operatorId];
    try {
      await bot.api.sendMessage(targetUserId, '✅ Чат з оператором завершено.');
    } catch (e) {
      console.log('Не вдалось повідомити користувача:', e.message);
    }
    delete operatorChats[operatorId];
    delete operatorChats[targetUserId];
  }

  delete userState[operatorId];
  await ctx.reply('💬 Чат завершено.');
  try {
    await ctx.deleteMessage();
  } catch (e) {
    console.log('Не вдалося видалити повідомлення:', e.message);
  }
  await ctx.answerCallbackQuery();
});

// Зв'язок з оператором
bot.callbackQuery('contact_operator', async ctx => {
  const userId = ctx.from.id;
  if (queue.some(user => user.id === userId)) {
    await ctx.answerCallbackQuery();
    return ctx.reply('Ви вже в черзі.');
  }
  if (operatorChats[userId]) {
    await ctx.answerCallbackQuery();
    return ctx.reply('Ви вже спілкуєтеся з оператором.');
  }

  queue.push({
    id: userId,
    name: ctx.from.first_name || 'Користувач',
    username: ctx.from.username,
  });
  await ctx.reply('⌛ Вас додано в чергу. Очікуйте.');

  try {
    await bot.api.sendMessage(
      BOT_ADMIN_ID,
      `🆕 Новий запит в черзі від ${ctx.from.first_name}${ctx.from.username ? ` (@${ctx.from.username})` : ''} [ID: ${userId}]\n\nВ черзі: ${queue.length}`,
      { reply_markup: new InlineKeyboard().text('Переглянути чергу', 'view_queue') }
    );
  } catch (e) {
    console.error('Не вдалося сповістити оператором:', e);
  }

  await ctx.answerCallbackQuery();
});

bot.callbackQuery('view_queue', async ctx => {
  if (ctx.from.id !== BOT_ADMIN_ID) return ctx.answerCallbackQuery({ text: 'Ви не оператор.' });
  if (queue.length === 0) {
    await ctx.answerCallbackQuery();
    return ctx.reply('Черга пуста.');
  }

  let message = '📋 Черга:\n\n';
  queue.forEach((user, index) => {
    message += `${index + 1}. ${user.name}${user.username ? ` (@${user.username})` : ''} [ID: ${user.id}]\n`;
  });

  await ctx.editMessageText(message, {
    reply_markup: new InlineKeyboard().text('Прийняти першого', 'accept_first'),
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('accept_first', async ctx => {
  if (ctx.from.id !== BOT_ADMIN_ID) return ctx.answerCallbackQuery({ text: 'Ви не оператор.' });
  if (queue.length === 0) return ctx.answerCallbackQuery({ text: 'Черга пуста.' });

  const firstUser = queue.shift();
  operatorChats[BOT_ADMIN_ID] = firstUser.id;
  operatorChats[firstUser.id] = BOT_ADMIN_ID;
  userState[BOT_ADMIN_ID] = { step: 'replying', targetUserId: firstUser.id };

  try {
    await bot.api.sendMessage(
      firstUser.id,
      '✅ Оператор прийняв ваш запит. Тепер ви можете спілкуватися.'
    );
  } catch (e) {
    console.error('Не вдалося сповістити користувача:', e);
  }

  await ctx.editMessageText(
    `💬 Чат з ${firstUser.name}${firstUser.username ? ` (@${firstUser.username})` : ''} [ID: ${firstUser.id}]\n\nТепер ви можете спілкуватися тут.`,
    { reply_markup: new InlineKeyboard().text('Завершити чат', `end_queue_chat_${firstUser.id}`) }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(/^end_queue_chat_(\d+)$/, async ctx => {
  const targetUserId = Number(ctx.match[1]);
  const operatorId = ctx.from.id;

  if (operatorChats[operatorId] === targetUserId) {
    try {
      await bot.api.sendMessage(targetUserId, '✅ Чат з оператором завершено. Дякуємо!');
    } catch (e) {
      console.log('Не вдалось повідомити користувача:', e.message);
    }
    delete operatorChats[operatorId];
    delete operatorChats[targetUserId];
    delete userState[operatorId];
  }

  await ctx.editMessageText(`💬 Чат з користувачем ${targetUserId} завершено.`);
  await ctx.answerCallbackQuery();
});

// Запуск бота
bot.start();
console.log('Бот запущено');

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
