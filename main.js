const values = require('./values')
const keyboards = require('./keyboards')
const Telegraf = require('telegraf')
const WizardScene = require('telegraf/scenes/wizard')
const {Stage, session} = require("telegraf");
const bot = new Telegraf(values.TOKEN)

const order = require('./scenes/order')
const uploader = require('./scenes/uploader')
const admin = require('./scenes/admin')
const {uploadUsersStatistics, uploadOrdersStatistics} = require("./googleSheets");
setInterval(uploadUsersStatistics, 3 * 60 * 1000)
setInterval(uploadOrdersStatistics, 6 * 60 * 1000)
const newOrderScene = new WizardScene('new-order-scene', order.chooseModel, order.selectModelHandler, order.chooseContentSortHandler, order.photoOrVideoHandler, order.minuteCountHandler, order.scriptTextHandler, order.memberLinkHandler, order.priceHandler)
const uploadContentScene = new WizardScene('upload-content-scene', uploader.getContent)
const addUserScene = new WizardScene('add-user-scene', admin.addID, admin.addName, admin.chooseRole)
const stage = new Stage([newOrderScene, uploadContentScene, addUserScene])

bot.use((ctx, next) => {
    console.log(ctx?.message?.message_id)
    next()
})
bot.use((ctx, next) => {
    console.log(ctx.userData?.position)
    return next()
})
bot.on('callback_query', (ctx, next) => {
    ctx.answerCbQuery()
    next()
})
bot.use(require('./middlewares/db').readUserData)
bot.hears('📊Статистика', require('./middlewares/hears/statistics'))
bot.hears('✉Показать заявки', require('./middlewares/hears/showOrders'))
bot.hears('🪄Управление пользователями', require('./middlewares/hears/usersManagement')) // HOTFIX
bot.use(session(), stage.middleware())

bot.start(require('./middlewares/commands/start'))
bot.command('admin', require('./middlewares/commands/admin'))

bot.hears('🔗Привязать модель', require('./middlewares/hears/linkModel'))
bot.hears('🪄Управление пользователями', require('./middlewares/hears/usersManagement'))

bot.hears('💖Новая заявка', ctx => ctx.scene.enter('new-order-scene'))
bot.hears('✨Мои заявки', require('./middlewares/hears/myOrders'))

bot.hears('💖Загрузить контент', async (ctx, next) => {
    const db = await require('./dbManager')
    ctx.userData.position = 'upload_content'
    if (ctx.userData.role === 'photographer' && !ctx.userData?.linkedModelData) {
        return ctx.reply('Необходимо привязать модель!')
    }

    ctx.reply(`${ctx.userData?.linkedModelData?.name ?
        `Модель <a href="tg://user?id=${ctx.userData.linkedModelData.userID}">${ctx.userData.linkedModelData.name}</a>` :
        ''}
Выберете сет`, {reply_markup: keyboards.sets, parse_mode: "HTML",}
    )
    /*
    ctx.reply((() => {
        if (ctx.userData?.linkedModelData?.name){
            return `Модель <a href="tg://user?id=${ctx.userData.linkedModelData.userID}">${ctx.userData.linkedModelData.name}</a>`
        }
        return ''
    }) + 'Выберете сет', {reply_markup: keyboards.sets, parse_mode: "HTML"}

)
     */
    next()
})
/*
bot.hears('❌Отменить загрузку', (ctx, next) => {
    ctx.userData.position = ''
    ctx.scene.leave()
    ctx.reply('Меню модели', {reply_markup: keyboards.mainModel})
    next()
})
*/
bot.action(/link_model*/, require('./middlewares/actions/linkModel'))
bot.action('add_user', ctx => {
    ctx.reply('Введите ID');
    ctx.scene.enter('add-user-scene')
})
bot.action('remove_user_choice', require('./middlewares/actions/usersDeleteList'))

bot.action('back', ctx => {
    switch (ctx.userData.position) {
        case 'users_list':
            ctx.editMessageText('Админ панель', {reply_markup: require('./keyboards').adminPanel})
            break
        case 'my_orders':
            ctx.editMessageText('<b>Выберете тип заявки</b>', {reply_markup: keyboards.orderTypes, parse_mode: "HTML"})
            break
        case 'upload_content':
            ctx.editMessageText('Главное меню')
            break
        case /orders_list*/:
            ctx.callbackQuery.data = ctx.userData.position
            require('./middlewares/actions/ordersList')(ctx)
    }
})
bot.action([/set_*/, 'ad'], (ctx, next) => {
    const data = ctx.callbackQuery.data
    ctx.userData.temp = ctx.userData.temp || {}
    if (data === 'ad') {
        ctx.userData.temp.set = data
    } else {
        ctx.userData.temp.set = parseInt(data.slice(4))
    }

    ctx.deleteMessage()
    // ctx.callbackQuery.message.message_id
    ctx.reply('Отправьте контент для загрузки!', {reply_markup: keyboards.uploading.resize()})
    ctx.scene.enter('upload-content-scene')
    next()
})


bot.action(/orders_list*/, require('./middlewares/actions/ordersList'))
bot.action(/select_order*/, require('./middlewares/actions/selectOrder'))
bot.action(/upload_content*/, require('./middlewares/actions/uploadContent'))
bot.action('show_users', require('./middlewares/actions/usersList'))
bot.action(/delete_order*/, require('./middlewares/actions/deleteOrder'))
bot.action(/delete_user*/, require('./middlewares/actions/deleteUser'))

bot.use(require('./middlewares/db').writeUserData)

bot.launch().then()
process.on('uncaughtException', error => {
    console.log(error)
})