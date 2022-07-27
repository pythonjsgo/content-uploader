const values = require('../values')
const keyboards = require('../keyboards')
const Telegraf = require("telegraf");
const {ObjectId} = require("mongodb");
const isUrl = require('is-url')

const google = require('../google')

module.exports.addID = async (ctx, next) => {

    const db = await require('../dbManager')

    ctx.userData.addUserData = {}
    const text = ctx.message.text
    if (!isNaN(text)) {
        ctx.userData.addUserData.userID = parseInt(text)
        ctx.reply('<b>Введите имя пользователя</b>', {parse_mode: "HTML"})
        ctx.wizard.next()
    } else {
        ctx.reply('Неверный user id')
        return ctx.scene.leave()
    }
    next()
}
module.exports.addName = async (ctx, next) => {
    const db = await require('../dbManager')
    const text = ctx.message.text
    if (text.length > 2) {
        ctx.userData.addUserData.name = text
        ctx.reply('Выберете роль пользователя', {reply_markup: keyboards.roles})
        ctx.wizard.next()
    } else {
        ctx.reply('Неверное имя')
        return ctx.scene.leave()
    }
    next()

}
module.exports.chooseRole = Telegraf.action(['model', 'operator', 'photographer'], async (ctx, next) => {
    const db = await require('../dbManager')
    const role = ctx.callbackQuery.data
    console.log(role)
    let userData = values.DEFAULT_USER_DATA
    userData.name = ctx.userData.addUserData.name
    userData.userID = ctx.userData.addUserData.userID
    userData.role = role
    await ctx.editMessageText(`Добавление пользователя ${JSON.stringify(ctx.userData.addUserData)}`)
    await db.users.insertOne({...userData})
    ctx.editMessageText('Пользователь успешно добавлен!')
    return next()
})