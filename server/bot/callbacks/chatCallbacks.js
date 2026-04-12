import { InlineKeyboard } from 'grammy';

import Support from '../../model/support.js';
import { GROUP_ID, bot, BOT_ADMIN_ID } from '../config/index.js';
import {
  userState,
  operatorChats,
  activeComplaints,
  assignedOperators,
  queue,
} from '../services/state.js';

export const setupChatCallbacks = botInstance => {
  botInstance.callbackQuery(/^start_chat_(.+)$/, async ctx => {
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
      // eslint-disable-next-line no-console
      console.log('Не вдалося повідомити користувача:', e.message);
    }

    await ctx.reply(
      `💬 Чат з користувачем ${complaintData.userId} по скарзі #${complaintId}.\n\nТепер вы можете спілкуватися тут.`,
      { reply_markup: new InlineKeyboard().text('✅ Завершити чат', `end_chat_${complaintId}`) }
    );

    try {
      await ctx.deleteMessage();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Не вдалося видалити повідомлення:', e.message);
    }
    await ctx.answerCallbackQuery();
  });

  botInstance.callbackQuery(/^end_chat_(.+)$/, async ctx => {
    const operatorId = ctx.from.id;

    if (operatorChats[operatorId]) {
      const targetUserId = operatorChats[operatorId];
      try {
        await bot.api.sendMessage(targetUserId, '✅ Чат з оператором завершено.');
      } catch (e) {
        // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.log('Не вдалося видалити повідомлення:', e.message);
    }
    await ctx.answerCallbackQuery();
  });

  botInstance.callbackQuery('contact_operator', async ctx => {
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

  botInstance.callbackQuery('view_queue', async ctx => {
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

  botInstance.callbackQuery('accept_first', async ctx => {
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

  botInstance.callbackQuery(/^end_queue_chat_(\d+)$/, async ctx => {
    const targetUserId = Number(ctx.match[1]);
    const operatorId = ctx.from.id;

    if (operatorChats[operatorId] === targetUserId) {
      try {
        await bot.api.sendMessage(targetUserId, '✅ Чат з оператором завершено. Дякуємо!');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Не вдалось повідомити користувача:', e.message);
      }
      delete operatorChats[operatorId];
      delete operatorChats[targetUserId];
      delete userState[operatorId];
    }

    await ctx.editMessageText(`💬 Чат з користувачем ${targetUserId} завершено.`);
    await ctx.answerCallbackQuery();
  });
};
