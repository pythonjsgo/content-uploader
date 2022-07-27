const db = require('../../dbManager')
const values = require('../../values')
const keyboards = require('../../keyboards')

module.exports = async (ctx, next) => {
    ctx.userData.started++
    switch (ctx.userData.role) {
        case 'operator':
            ctx.reply('Меню оператора', {reply_markup: keyboards.mainOperator})
            break
        case 'admin':
            ctx.reply('Панель администратора', {reply_markup: keyboards.mainAdmin})
            break
        case 'model':
            ctx.reply('Меню модели', {reply_markup: keyboards.mainModel})
            break
        case 'photographer':
            ctx.reply(`Меню фотографа\nПривязана модель: ${ctx.userData?.linkedModelData?.name}`, {reply_markup: keyboards.mainPhotographer})
            break
        default:
            ctx.reply(`<b>Вы незарегистрированны в боте!</b>
Ваш ID - <code>${ctx.from.id}</code>`, {parse_mode: "HTML"})
    }
    next()
}

//пиздец