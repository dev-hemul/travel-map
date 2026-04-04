import { BOT_ADMIN_ID } from '../config/index.js';
import { saveComplaintAndNotify } from '../services/complaintService.js';
import { userState, operatorChats, lastComplaintTime } from '../services/state.js';

export const setupHandlers = bot => {
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
        const prefix = userId === BOT_ADMIN_ID ? '📩 Оператор:' : `📞 Користувач (ID: ${userId}):`;
        const successMsg =
          userId === BOT_ADMIN_ID
            ? '✅ Повідомлення відправлено користувачу.'
            : '✅ Ваше повідомлення надіслано оператору.';
        await bot.api.sendMessage(targetUserId, `${prefix} ${ctx.message.text}`);
        await ctx.reply(successMsg);
      } catch {
        const failMsg =
          userId === BOT_ADMIN_ID
            ? 'Не вдалося надіслати повідомлення користувачу.'
            : 'Не вдалося надіслати повідомлення оператору.';
        await ctx.reply(failMsg);
      }
      return;
    }
  });
};
