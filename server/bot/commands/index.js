import { InlineKeyboard } from 'grammy';

import Support from '../../model/support.js';
import { BOT_ADMIN_ID } from '../config/index.js';
import { assignedOperators, activeComplaints } from '../services/state.js';

export const startCommand = async ctx => {
  await ctx.reply('Привіт! Я бот підтримки, чим можу допомогти?', {
    reply_markup: new InlineKeyboard()
      .text('📝 Відправити скаргу', 'send_complaint')
      .row()
      .text("📞 Зв'язатися з оператором", 'contact_operator'),
  });
};

export const helpCommand = async ctx => {
  await ctx.reply(`Команди бота:
/start — Запуск бота
/complaints — Скарги (оператор)
/contact — Зв'язатися з оператором
/help — Допомога`);
};

export const complaintsCommand = async ctx => {
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
};
