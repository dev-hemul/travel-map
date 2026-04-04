import { InlineKeyboard } from 'grammy';

import Support from '../../model/support.js';
import { GROUP_ID, bot } from '../config/index.js';
import { handleResolveComplaint, saveComplaintAndNotify } from '../services/complaintService.js';
import {
  userState,
  activeComplaints,
  COOLDOWN_MS,
  lastComplaintTime,
  assignedOperators,
} from '../services/state.js';

export const setupComplaintCallbacks = botInstance => {
  botInstance.callbackQuery('send_complaint', async ctx => {
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

  botInstance.callbackQuery(/^take_complaint_(.+)$/, async ctx => {
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

  botInstance.callbackQuery(/^start_chat_from_group_(.+)$/, async ctx => {
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

  botInstance.callbackQuery(/^resolve_(.+)$/, async ctx => {
    const complaintId = ctx.match[1];
    const operatorId = ctx.from.id;
    const operatorName = ctx.from.first_name || 'Оператор';

    if (
      assignedOperators[complaintId] &&
      assignedOperators[complaintId].operatorId !== operatorId
    ) {
      await ctx.answerCallbackQuery({
        text: `Цю скаргу займає ${assignedOperators[complaintId].operatorName}. Тільки він може її вирішити.`,
      });
      return;
    }

    await handleResolveComplaint(ctx, complaintId, operatorName);
    await ctx.answerCallbackQuery();
  });

  botInstance.callbackQuery(/^resolve_group_(.+)$/, async ctx => {
    const complaintId = ctx.match[1];
    const operatorId = ctx.from.id;
    const operatorName = ctx.from.first_name || 'Оператор';

    if (
      assignedOperators[complaintId] &&
      assignedOperators[complaintId].operatorId !== operatorId
    ) {
      await ctx.answerCallbackQuery({
        text: `Цю скаргу займає ${assignedOperators[complaintId].operatorName}. Тільки він може її вирішити.`,
      });
      return;
    }

    await handleResolveComplaint(ctx, complaintId, operatorName);
    await ctx.answerCallbackQuery();
  });

  botInstance.callbackQuery(/^cat_/, async ctx => {
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
};
