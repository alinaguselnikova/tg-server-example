const TelegramBot = require("node-telegram-bot-api");
const express = require('express')
const cors = require('cors')

const token = "6668994516:AAGpWOzjqcQYtLMPwx7KjbKyoJuwVgEMstI";
const webAppUrl = "https://euphonious-melba-92fb97.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    // await bot.sendMessage(
    //   chatId,
    //   "Добро пожаловать в Eco Bot! Чтобы начать работу, нажмите кнопку начать внизу экрана или под этим сообщением.",
    //   {
    //     reply_markup: {
    //       inline_keyboard: [[{ text: "Начать", web_app: { url: webAppUrl } }]],
    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
        reply_markup: {
            keyboard: [
                [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
            ]
        },
      }
    );
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data)
      await bot.sendMessage(chatId,"Ваш регион: " + data?.region);
      await bot.sendMessage(chatId,"Ваш город: " + data?.city);
      await bot.sendMessage(chatId,"Ваша улица: " + data?.street);
      await bot.sendMessage(chatId,"Ваш радиус: " + data?.radius);
      await bot.sendMessage(chatId, 'Ниже появится кнопка, выбери вещи', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Выбери вещи', web_app: {url: webAppUrl + '/items'}}]
            ]
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
});

app.post( '/web-data',  async (req, res) => {
  const {queryId, items, totalPrice} = req.body;
  console.log(`fuck me: ${req.body}`)
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Выбранные вещи',
      input_message_content:{ message_text: 'Вы выбрали ' + items.map((item)=>item.title).join(', ') }
    })
    return res.status(200).json({});
  } catch (e) {
    return res.status(500)
  }
})

const PORT = 3001;
console.log('Ima started');
app.listen(PORT, () => console.log('server started on PORT' + PORT))
