require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN topilmadi. Railway Variables yoki .env ni tekshiring.");
  process.exit(1);
}

if (!ADMIN_ID) {
  console.error("❌ ADMIN_ID topilmadi. Railway Variables yoki .env ni tekshiring.");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const userState = {};

// 3–4 kishilik uy rasmlari — 100$
const home4Photos = [
  "https://i.ibb.co/xSMq27Fv/photo-2026-07-03-11-53-00.jpg",
  "https://i.ibb.co/RkT0ByCV/photo-2026-07-03-11-53-05.jpg",
  "https://i.ibb.co/C3cKkCcY/photo-2026-07-03-11-53-07.jpg",
  "https://i.ibb.co/Y4SJTS1G/photo-2026-07-03-11-53-09.jpg",
  "https://i.ibb.co/zWNnXvF0/photo-2026-07-03-11-53-14.jpg",
  "https://i.ibb.co/8D1S5L03/photo-2026-07-03-11-53-30.jpg",
  "https://i.ibb.co/0jVyw99z/photo-2026-07-03-11-53-28.jpg",
  "https://i.ibb.co/JRDJsyf5/photo-2026-07-03-11-53-32.jpg"
];

// 6–10 kishilik uy rasmlari — 200$
const home6Photos = [
  "https://i.ibb.co/XrJjhtmG/photo-2026-07-03-11-46-18.jpg",
  "https://i.ibb.co/Lz9cZ1Z7/photo-2026-07-03-11-46-20.jpg",
  "https://i.ibb.co/PZhnJJ9r/photo-2026-07-04-15-00-10.jpg",
  "https://i.ibb.co/1G4PVTXP/photo-2026-07-04-15-00-17.jpg",
  "https://i.ibb.co/pjCzFHNX/photo-2026-07-04-15-00-19.jpg",
  "https://i.ibb.co/mFdx8yBP/photo-2026-07-04-15-00-20.jpg",
  "https://i.ibb.co/90NNbw3/photo-2026-07-04-15-00-22.jpg",
  "https://i.ibb.co/fGQNzZCT/photo-2026-07-04-15-00-24.jpg"
];

const mainMenu = Markup.keyboard([
  ["🏡 Dam olish uylari", "💰 Narxlar"],
  ["📅 Bron qilish", "📍 Lokatsiya"],
  ["📞 Bog‘lanish", "📷 Instagram"],
  ["✈️ Telegram"]
]).resize();

function getUsername(ctx) {
  return ctx.from.username ? `@${ctx.from.username}` : "Username yo‘q";
}

function startBooking(ctx, selectedHome = null) {
  userState[ctx.from.id] = {
    step: "name",
    data: {
      home: selectedHome
    }
  };

  return ctx.reply("👤 Ismingizni yozing:");
}

async function sendPhotoGroup(ctx, photos, caption) {
  try {
    const media = photos.map((photo, index) => ({
      type: "photo",
      media: photo,
      caption: index === 0 ? caption : undefined
    }));

    await ctx.replyWithMediaGroup(media);
  } catch (error) {
    console.error("❌ Rasm yuborishda xato:", error.message);
    await ctx.reply(caption);
  }
}

async function sendHomes(ctx) {
  const home4Caption = `1️⃣ 3–4 kishilik uy

✅ Wi-Fi
✅ Smart TV
✅ Konditsioner
✅ Barbekyu zona
✅ Tog‘ manzarasi

💰 Narx:
Dushanbadan jumagacha — 100$
Jumadan yakshanbagacha — 1 400 000 so‘m`;

  await sendPhotoGroup(ctx, home4Photos, home4Caption);

  await ctx.reply(
    "🏡 3–4 kishilik uyni bron qilish uchun pastdagi tugmani bosing:",
    Markup.inlineKeyboard([
      [Markup.button.callback("📅 3–4 kishilik uyni bron qilish", "book_4")]
    ])
  );

  const home6Caption = `2️⃣ 6–10 kishilik uy

✅ Wi-Fi
✅ Smart TV
✅ Oshxona
✅ Katta hovli
✅ Barbekyu zona
✅ Tog‘ manzarasi

💰 Narx:
Dushanbadan jumagacha — 200$
Jumadan yakshanbagacha — 2 600 000 so‘m`;

  await sendPhotoGroup(ctx, home6Photos, home6Caption);

  await ctx.reply(
    "🏡 6–10 kishilik uyni bron qilish uchun pastdagi tugmani bosing:",
    Markup.inlineKeyboard([
      [Markup.button.callback("📅 6–10 kishilik uyni bron qilish", "book_6")]
    ])
  );
}

bot.start((ctx) => {
  ctx.reply(
    `🏠⛰️ Humo Garden Resort'ga xush kelibsiz!

Yuragingiz orom va qalbingiz sokinlik topadigan makon.

Quyidagilardan birini tanlang:`,
    mainMenu
  );
});

bot.hears("🏡 Dam olish uylari", async (ctx) => {
  await sendHomes(ctx);
});

bot.hears("💰 Narxlar", (ctx) => {
  ctx.reply(
    `💰 Narxlar:

🏡 3–4 kishilik uy
Dushanbadan jumagacha — 100$
Jumadan yakshanbagacha — 1 400 000 so‘m

🏡 6–10 kishilik uy
Dushanbadan jumagacha — 200$
Jumadan yakshanbagacha — 2 600 000 so‘m`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📅 Bron qilish", "start_booking")]
    ])
  );
});

bot.hears("📍 Lokatsiya", (ctx) => {
  ctx.reply(
    `📍 Manzil:
"Qamchiq" dovoni, Ertashsoy turizm qishlog‘i

🗺 Lokatsiya:
https://yandex.uz/maps/?ll=70.343960%2C41.165430&mode=whatshere&rtd=0&rtext=40.841176%2C69.607719~41.165457%2C70.343918&rtt=auto&ruri=~&whatshere%5Bpoint%5D=70.343923%2C41.165473&whatshere%5Bzoom%5D=19.98&z=19.98`
  );
});

bot.hears("📞 Bog‘lanish", (ctx) => {
  ctx.reply(
    `📞 Murojaat uchun:

+998 90 012 10 00
+998 94 385 66 00
+998 94 120 66 00

📩 Telegram: @humo_garden
🤖 Bot: @humogarden_bot`,
    Markup.inlineKeyboard([
      [Markup.button.url("✈️ Telegram kanal", "https://t.me/humo_garden_resort")],
      [Markup.button.url("🤖 Telegram bot", "https://t.me/humogarden_bot")],
      [Markup.button.url("📷 Instagram", "https://www.instagram.com/humo_garden_resort?igsh=MTl0bm9uN3pvZGs1cw==")]
    ])
  );
});

bot.hears("📷 Instagram", (ctx) => {
  ctx.reply(
    "📷 Instagram sahifamiz:",
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "Instagramga o‘tish",
          "https://www.instagram.com/humo_garden_resort?igsh=MTl0bm9uN3pvZGs1cw=="
        )
      ]
    ])
  );
});

bot.hears("✈️ Telegram", (ctx) => {
  ctx.reply(
    "✈️ Telegram kanalimiz:",
    Markup.inlineKeyboard([
      [Markup.button.url("Telegram kanalga o‘tish", "https://t.me/humo_garden_resort")]
    ])
  );
});

bot.hears("📅 Bron qilish", (ctx) => {
  startBooking(ctx);
});

bot.action("book_4", async (ctx) => {
  await ctx.answerCbQuery();
  startBooking(ctx, "3–4 kishilik uy");
});

bot.action("book_6", async (ctx) => {
  await ctx.answerCbQuery();
  startBooking(ctx, "6–10 kishilik uy");
});

bot.action("start_booking", async (ctx) => {
  await ctx.answerCbQuery();
  startBooking(ctx);
});

bot.action("home_4", async (ctx) => {
  const userId = ctx.from.id;

  if (!userState[userId]) return ctx.answerCbQuery();

  userState[userId].data.home = "3–4 kishilik uy";
  userState[userId].step = "date";

  await ctx.answerCbQuery();
  ctx.reply("📅 Kelish sanasini yozing. Masalan: 15-iyul");
});

bot.action("home_6", async (ctx) => {
  const userId = ctx.from.id;

  if (!userState[userId]) return ctx.answerCbQuery();

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
    return ctx.reply("📞 Telefon raqamingizni yozing. Masalan: +998 90 123 45 67");
  }

  if (state.step === "phone") {
    state.data.phone = text;

    if (state.data.home) {
      state.step = "date";
      return ctx.reply("📅 Kelish sanasini yozing. Masalan: 15-iyul");
    }

    state.step = "home";

    return ctx.reply(
      "🏡 Qaysi dam olish uyi kerak?",
      Markup.inlineKeyboard([
        [Markup.button.callback("3–4 kishilik uy", "home_4")],
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

    const username = getUsername(ctx);

    const adminMessage = `🆕 Yangi bron so‘rovi!

👤 Ism: ${state.data.name}
📞 Telefon: ${state.data.phone}
🏡 Uy turi: ${state.data.home}
📅 Kelish sanasi: ${state.data.date}
👥 Mehmonlar soni: ${state.data.guests}
📝 Izoh: ${state.data.comment}

🆔 Telegram: ${username}
🔢 Telegram ID: ${userId}`;

    await bot.telegram.sendMessage(ADMIN_ID, adminMessage);

    await ctx.reply(
      `✅ Rahmat! Bron so‘rovingiz qabul qilindi.

Tez orada administrator siz bilan bog‘lanadi.

🏠⛰️ Humo Garden Resort`,
      mainMenu
    );

    delete userState[userId];
  }
});

bot.catch((error) => {
  console.error("❌ Bot xatosi:", error);
});

bot.launch();

console.log("✅ Humo Garden Resort bot ishga tushdi.");