const {gameOptions, againOptions, offer} = require('./options.js')
const {token} = require('./token.js')
const TelegramApi = require('node-telegram-bot-api')


const bot = new TelegramApi(token, {polling : true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId,`Старина сейчас цифру в уме накину от 0 до 9, давай угадывай`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
    console.log( chats[chatId])
}

const start = () => {

        bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Получить о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
        //{command: '/offer', description: 'Предложение сыграть'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
           await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/093/31b/09331bef-582c-347a-b01f-6932bbb08f6a/10.webp');
           return bot.sendMessage(chatId, 'Приветик старина, проходи.\nМожет хочешь схлестнуться?', offer);
           
         
        }
        if (text === '/info') {
          return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name} `)
        }
          if (text === '/game') {
              return startGame(chatId)
             

        }
        return bot.sendMessage(chatId, 'Дружище, шото не ясно')
    })
   
       
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data ==='/offer'){
            return startGame(chatId)
        }
                if ( data === '/again') {
            return startGame(chatId)
        }
       
        if (data == chats[chatId]) {
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/7ac/05c/7ac05c01-2e52-30ce-bedf-2f5bb1da12e7/1.webp')
             return bot.sendMessage(chatId, `Мое почтение, старина, верно это - ${chats[chatId]}`,againOptions)
        }else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/98a/244/98a244fc-90d1-493b-b57e-d0df3fcf5449/1.webp')
            return bot.sendMessage(chatId, `Не фортануло, родной, цифра была - ${chats[chatId]}`, againOptions)
            
        }
    })
}
start()