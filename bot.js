require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;

const userState = {};

const mainMenu = Markup.keyboard([
  ["🏡 Dam olish uylari", "💰 Narxlar"],
  ["📅 Bron qilish", "📍 Lokatsiya"],
  ["📞 Bog‘lanish", "📷 Instagram"]
]).resize();

bot.start((ctx) => {
  ctx.reply(
    `🏔 Humo Garden Resort'ga xush kelibsiz!

Yuragingiz orom va qalbingiz sokinlik topadigan dam olish maskani.

Quyidagilardan birini tanlang:`,
    mainMenu
  );
});

bot.hears("🏡 Dam olish uylari", (ctx) => {
  ctx.reply(
    `🏡 Humo Garden Resort dam olish uylari:

1️⃣ 4 kishilik uy
✅ Wi-Fi
✅ Smart TV
✅ Konditsioner
✅ Barbekyu zona
✅ Tog‘ manzarasi

2️⃣ 6–10 kishilik uy
✅ Wi-Fi
✅ Smart TV
✅ Oshxona
✅ Katta hovli
✅ Barbekyu zona
✅ Tog‘ manzarasi`
  );
});

bot.hears("💰 Narxlar", (ctx) => {
  ctx.reply(
    `💰 Narxlar:

🏡 3-4 kishilik uy
Dushanbadan jumagacha — 100$

Jumadan yakshanbagacha — 1 400 000 so‘m

🏡 6–10 kishilik uy
Dushanbadan jumagacha — 200$   

Jumadan yakshanbagacha — 2 600 000 so‘m`
  );
});

bot.hears("📍 Lokatsiya", (ctx) => {
  ctx.reply(
    `📍 Manzil:
"Qamchiq" dovoni, Ertashsoy turizm qishlog‘i

🗺 Lokatsiya:
https://yandex.uz/maps/?ll=70.343960%2C41.165430&mode=whatshere&whatshere%5Bpoint%5D=70.343923%2C41.165473&whatshere%5Bzoom%5D=19.98&z=19.98`
  );
});

bot.hears("📞 Bog‘lanish", (ctx) => {
  ctx.reply(
    `📞 Murojaat uchun:

+998 90 012 10 00
+998 94 385 66 00
+998 94 120 66 00

📩 Telegram: @humo_garden`
  );
});

bot.hears("📷 Instagram", (ctx) => {
  ctx.reply("📷 Instagram: https://www.instagram.com/humo_garden_resort");
});

bot.hears("📅 Bron qilish", (ctx) => {
  userState[ctx.from.id] = {
    step: "name",
    data: {}
  };

  ctx.reply("👤 Ismingizni yozing:");
});

bot.action("home_4", async (ctx) => {
  const userId = ctx.from.id;

  if (!userState[userId]) return;

  userState[userId].data.home = "3-4 kishilik uy";
  userState[userId].step = "date";

  await ctx.answerCbQuery();
  ctx.reply("📅 Kelish sanasini yozing. Masalan: 15-iyul");
});

bot.action("home_6", async (ctx) => {
  const userId = ctx.from.id;

  if (!userState[userId]) return;

  userState[userId].data.home = "6–10 kishilik uy";
  userState[userId].step = "date";

  await ctx.answerCbQuery();
  ctx.reply("📅 Kelish sanasini yozing. Masalan: 15-iyul");
});

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const state = userState[userId];

  if (!state) return;

  const text = ctx.message.text;

  if (state.step === "name") {
    state.data.name = text;
    state.step = "phone";
    return ctx.reply("📞 Telefon raqamingizni yozing:");
  }

  if (state.step === "phone") {
    state.data.phone = text;
    state.step = "home";

    return ctx.reply(
      "🏡 Qaysi dam olish uyi kerak?",
      Markup.inlineKeyboard([
        [Markup.button.callback("3-4 kishilik uy", "home_4")],
        [Markup.button.callback("6–10 kishilik uy", "home_6")]
      ])
    );
  }

  if (state.step === "date") {
    state.data.date = text;
    state.step = "guests";
    return ctx.reply("👥 Necha kishi bo‘lib borasiz?");
  }

  if (state.step === "guests") {
    state.data.guests = text;
    state.step = "comment";
    return ctx.reply("📝 Qo‘shimcha izoh yozing. Agar izoh bo‘lmasa, 'yo‘q' deb yozing:");
  }

  if (state.step === "comment") {
    state.data.comment = text;

    const username = ctx.from.username ? `@${ctx.from.username}` : "Username yo‘q";

    const adminMessage = `
🆕 Yangi bron so‘rovi!

👤 Ism: ${state.data.name}
📞 Telefon: ${state.data.phone}
🏡 Uy turi: ${state.data.home}
📅 Sana: ${state.data.date}
👥 Mehmonlar soni: ${state.data.guests}
📝 Izoh: ${state.data.comment}

🆔 Telegram: ${username}
`;

    await bot.telegram.sendMessage(ADMIN_ID, adminMessage);

    await ctx.reply(
      `✅ Rahmat! Bron so‘rovingiz qabul qilindi.

Tez orada administrator siz bilan bog‘lanadi.`,
      mainMenu
    );

    delete userState[userId];
  }
});

bot.launch();

console.log("✅ Humo Garden Resort bot ishga tushdi.");