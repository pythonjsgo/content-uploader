const keyboards = require('../../keyboards')
const {ObjectId} = require("mongodb");
module.exports = async ctx => {
    const db = await require('../../dbManager')
    let users = await db.users.find().toArray()
    if (users){
        ctx.editMessageText('<b>Пользователи</b>', {reply_markup: keyboards.usersDeleteBuilder(users), parse_mode: "HTML"})
    } else {
        ctx.editMessageText('Нет пользователей')
    }


}