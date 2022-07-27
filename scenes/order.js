const keyboards = require('../keyboards')
const Telegraf = require("telegraf");
const {ObjectId} = require("mongodb");
const isUrl = require('is-url')
const google = require('../google')
const uuid = require('uuid')

module.exports.chooseModel = async (ctx, next) => {
    const db = await require('../dbManager')
    if (ctx.userData.role === 'operator') {
        let models = await db.users.find({role: 'model'}).toArray()
        if (models.length > 0) {
            ctx.reply(`<b>Выберете модель из списка</b>
Найдено моделей - ${models.length}`, {
                reply_markup: await keyboards.modelsBuilder(models),
                parse_mode: "HTML"
            })
            return ctx.wizard.next()
        } else {
            ctx.reply('<b>Модели не найдены!</b>', {parse_mode: "HTML"})
            return ctx.scene.leave()
        }

    } else {
        ctx.reply('<b>Недостаточно прав!</b>', {parse_mode: "HTML"})
        return ctx.scene.leave()
    }
}
module.exports.selectModelHandler =  Telegraf.action(/select*/, async (ctx, next) => {
    const db = await require('../dbManager')
    const modelID = ctx.callbackQuery.data.split('|')[1]
    console.log('ofodfodfo')
    if (modelID && ctx.userData.role === 'operator') {
        let modelData = await db.users.findOne({_id: ObjectId(modelID)})
        ctx.userData.order = {}
        ctx.userData.order.model = ObjectId(modelID)
        ctx.userData.order.modelData = modelData
        ctx.userData.order.modelName = modelData.name
        ctx.editMessageText(`Выбрана модель ${modelData.name}`)
        ctx.reply(`<b>Выберете вид контента</b>`, {reply_markup: keyboards.contentSorts, parse_mode: "HTML"})
        ctx.wizard.next()
    }
    return next()
})
module.exports.chooseContentSortHandler = Telegraf.action(['custom', 'ad'], async (ctx, next) => {
    const sort = ctx.callbackQuery.data
    ctx.userData.order.sort = sort
    ctx.editMessageText('Вид контента установлен')
    ctx.reply(`<b>Выберете тид контента</b>`, {reply_markup: keyboards.photoOrVideo, parse_mode: "HTML"})
    ctx.wizard.next()
    return next()
})
module.exports.photoOrVideoHandler = Telegraf.action(['photo', 'video'], async (ctx, next) => {
    const type = ctx.callbackQuery.data
    console.log(type)
    console.log(ctx.userData)
    ctx.userData.order.type = type
    ctx.editMessageText('Тип контента установлен')

    if (type === 'video') {
        ctx.reply('Укажите количество минут:')
    } else {
        ctx.reply('Укажите количество фотографий:')
    }
    ctx.wizard.next()
    return next()
})
module.exports.minuteCountHandler = Telegraf.hears(/\d/, async (ctx, next) => {

    if (!isNaN(ctx.message.text)){
        ctx.userData.order.count = parseInt(ctx.message.text)
        ctx.reply('Опишите сценарий:')
        ctx.wizard.next()
    } else {
        ctx.reply('Неверное значение!')
    }
    return next()
})
module.exports.scriptTextHandler = async (ctx, next) => {
    ctx.userData.order.script = ctx.message.text
    await ctx.reply('Сценарий установлен')
    ctx.reply('Укажите ссылку на мембера:')
    ctx.wizard.next()
    return next()
}
module.exports.memberLinkHandler = async (ctx, next) => {
    const text = ctx.message.text
    ctx.userData.order.memberUrl = text
    await ctx.reply('Ccылка указана!')
    ctx.reply('Укажите цену кастома:')
    ctx.wizard.next()
    return next()
}
module.exports.priceHandler = async (ctx, next) => {
    const db = await require('../dbManager')
    if (!isNaN(ctx.message.text)){
        ctx.userData.order.price = parseInt(ctx.message.text)
        ctx.userData.order.status = 'active'
        ctx.userData.order.uuid = uuid.v4()
        let ruSort = ''
        if (ctx.userData.order.sort === 'custom'){
            ruSort = 'кастомный'
        } else {
            ruSort = 'рекламный'
        }
        ctx.userData.order.operatorID = ctx.from.id
        ctx.userData.order.creationTime = parseInt(Date.now()/1000)
        const {insertedId}  = await db.orders.insertOne({...ctx.userData.order})
        //const ruSort = sort => sort === 'custom' ? 'кастомный' || sort === 'ad'  'рекламный'
        let order = await db.orders.findOne({_id: ObjectId(insertedId)})

        switch (order.type) {
            case 'photo':
                await ctx.telegram.sendMessage(ctx.userData.order.modelData.userID,
                    `<b>Новая заявка</b>
Вид - ${ruSort}
Тип - фото
Количество фото - ${order.count}
Сценарий - ${order.script}
Ссылка на мембера - ${order.memberUrl}
Цена - ${order.price}
`, {reply_markup: keyboards.uploadContentBuilder(order._id),parse_mode: "HTML"})
                break
            case 'video':
                await ctx.telegram.sendMessage(ctx.userData.order.modelData.userID,
                    `<b>Новая заявка</b>
Вид - ${ruSort}
Тип - видео
Длительность - ${order.count} мин.
Сценарий - ${order.script}
Ссылка на мембера - ${order.memberUrl}
Цена - ${order.price}
`, {reply_markup: keyboards.uploadContentBuilder(order._id),parse_mode: "HTML"})
                break
        }

        await ctx.reply('Заявка отправлена!')
        ctx.scene.leave()
    } else {
        ctx.reply('Неверное количество минут!')
    }

    return next()
}


/*
Команда отправляет запрос
на кастомное видео
для определенной модели по форме:
1. Модель
2. Видео/фото.
3. Количество минут/количество фото
4. Подпобный сценарий кастома.
5. Ссылка на мембера, кто заказал кастом
6. Ваше имя/Ник в тг (того, кто взял кастом)
7.Цена за кастом

 */