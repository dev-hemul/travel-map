import { InlineKeyboard } from 'grammy';

import Support from '../../model/support.js';
import { GROUP_ID, bot, BOT_ADMIN_ID } from '../config/index.js';
import { activeComplaints, assignedOperators } from '../services/state.js';

export async function handleResolveComplaint(ctx, complaintId, operatorName) {
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
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log('Не вдалося видалити повідомлення:', e.message);
  }
}

export async function saveComplaintAndNotify(ctx, subject, message = '') {
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
