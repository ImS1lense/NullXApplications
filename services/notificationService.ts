
import { FormData } from "../types.ts";

const WEBHOOK_URL = "https://discord.com/api/webhooks/1467957480637071603/B9r9e_Ye5DSqenBhd7Od53TRJA5OK5iBJB09ZJZGF9kAFRTtO9pm1piWK2gwS51KMVtS";

export interface AnalyticsData {
  timeSpentSeconds: number;
  captchaAttempts: number;
  userAgent: string;
  quizTimeSeconds: number;
}

export const sendNotification = async (data: FormData, analytics: AnalyticsData) => {
  if (!WEBHOOK_URL || WEBHOOK_URL.includes("ВАШ_DISCORD_WEBHOOK")) return false;

  // Logic for rule checking
  const check = (val: string, correct: string) => 
    val.toLowerCase().trim() === correct.toLowerCase().trim() ? "✅ ВЕРНО" : `❌ ОШИБКА (Ответ: ${val || 'пусто'})`;

  const quizResults = [
    `1. Лимит тимы (5 чел): **${check(data.teamLimit, '5')}**`,
    `2. BetterPvP (Запрещен): **${check(data.betterPvpAllowed, 'no')}**`,
    `3. Мультиаккаунт (Нет): **${check(data.multiAccountAllowed, 'no')}**`,
    `4. Съемка проверки (Нет): **${check(data.recordCheckAllowed, 'no')}**`,
    `5. Наказание Деанон (Perm): **${check(data.deanonPunishment, 'permban')}**`,
    `6. "Слабак/ez" (Исключение): **${check(data.weaknessPunishment, 'no_punish')}**`,
    `7. Оск. мод (Mute 1д): **${check(data.insultModPunishment, 'mute_1d')}**`,
    `8. Реклама (Разрешены FT/HW): **${check(data.mentionAllowedProjects, 'yes')}**`,
  ];
  
  const testStatus = data.punishmentTestPassed 
    ? `✅ ПРОЙДЕН (Ошибок: ${data.punishmentTestMistakes})` 
    : "⚠️ ПРОПУЩЕН/НЕ ЗАВЕРШЕН";

  // Spam detection flag
  const isFastSubmit = analytics.timeSpentSeconds < 45; // less than 45 seconds to fill whole form
  const fastSubmitWarning = isFastSubmit ? "\n⚠️ **ПОДОЗРИТЕЛЬНО БЫСТРО**" : "";

  const embed = {
    title: "📑 АНКЕТА СТАЖЁРА: " + data.nickname + fastSubmitWarning,
    description: "Автоматический отчет системы проверки знаний NullX.",
    color: isFastSubmit ? 0xff0000 : 0x6200ea,
    thumbnail: { url: `https://minotar.net/helm/${data.nickname}/100.png` },
    fields: [
      { 
        name: "👤 КАНДИДАТ", 
        value: `**Discord:** \`${data.discord}\`\n**Возраст:** \`${data.age}\`\n**На проекте:** ${data.timeOnProject}`, 
        inline: true 
      },
      { 
        name: "🎮 ОНЛАЙН", 
        value: `**В день:** ${data.hoursDaily}\n**Прайм-тайм:** ${data.activeTime}`, 
        inline: true 
      },
      { name: "📝 О СЕБЕ", value: data.about || "—", inline: false },
      { name: "🛠 ОПЫТ МОДЕРАЦИИ", value: data.previousModExp || "Нет опыта", inline: false },
      { name: "⚡ ТЕСТ НАКАЗАНИЙ", value: `**Результат:** ${testStatus}`, inline: false },
      { name: "⚖️ РЕЗУЛЬТАТЫ КВИЗА", value: quizResults.join("\n"), inline: false },
      { 
        name: "🎯 МОТИВАЦИЯ", 
        value: `**Зачем:** ${data.expectations}\n**Обязанности:** ${data.duties}`, 
        inline: false 
      },
      {
        name: "📈 АНАЛИТИКА (СКРЫТО)",
        value: `⏱ **Общее время:** ${Math.floor(analytics.timeSpentSeconds / 60)}м ${analytics.timeSpentSeconds % 60}с\n🧠 **Время на тест:** ${analytics.quizTimeSeconds}с\n🤖 **Капча:** ${analytics.captchaAttempts} попыток\n📱 **Устройство:** ${analytics.userAgent}`,
        inline: false
      }
    ],
    footer: { text: "NullX Network Staff Recruitment System" },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: `🔔 **Поступила новая заявка на пост модератора!** <@&1458277039399374991>`, 
        embeds: [embed] 
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Webhook error:", error);
    return false;
  }
};
