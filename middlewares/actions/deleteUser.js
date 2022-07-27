const {ObjectId} = require("mongodb");

module.exports =async ctx => {
    const db = await require('../../dbManager')
    const ID = ObjectId(ctx.callbackQuery.data.split('|')[1])

    if (ctx.userData._id.toString() === ID.toString()){return ctx.reply('Вы не можете удалить самого себя!')}
    db.users.deleteOne({_id: ID}).then(r => {
        if (r.acknowledged === true){
            ctx.editMessageText('Пользователь успешно удален!')
        } else ctx.editMessageText('Произошла ошибка!')
    })
}