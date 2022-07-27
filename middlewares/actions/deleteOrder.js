const {ObjectId} = require("mongodb");
module.exports = async ctx => {
    const db = await require('../../dbManager')
    const orderID = ctx.callbackQuery.data.split('|')[1]
    await ctx.editMessageText('Удаление заявки')
    db.orders.deleteOne({_id: ObjectId(orderID)}).then(() =>
        ctx.editMessageText(`Заявка ${orderID} успешно удалена`)
    ).catch(() =>
        ctx.editMessageText('При удалении заявка возникла ошибка')
    )
}