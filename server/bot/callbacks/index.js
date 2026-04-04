import { setupChatCallbacks } from './chatCallbacks.js';
import { setupComplaintCallbacks } from './complaintCallbacks.js';
import { userState, operatorChats } from '../services/state.js';

export const setupCallbacks = bot => {
  bot.callbackQuery('cancel', async ctx => {
    const userId = ctx.from.id;
    delete userState[userId];
    if (operatorChats[userId]) delete operatorChats[userId];
    await ctx.reply('Дію скасовано.', { reply_markup: { remove_keyboard: true } });
    await ctx.answerCallbackQuery();
  });

  setupComplaintCallbacks(bot);
  setupChatCallbacks(bot);
};
