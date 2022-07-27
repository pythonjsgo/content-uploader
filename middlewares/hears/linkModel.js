const keyboards = require('../../keyboards')
const {ObjectId} = require("mongodb");
module.exports = async ctx => {
    const db = await require('../../dbManager')


    let users = await db.users.find({role: 'model'}).toArray()
    if (users.length){
        ctx.reply('<b>Доступные модели для привязки</b>', {reply_markup: keyboards.linkModelsBuilder(users), parse_mode: "HTML"})
    } else ctx.reply('<b>Нет доступных моделей</b>', {parse_mode: "HTML"})
    /* Не ебу что это и почему здесь было

    switch (type) {
        case 'all':

            if (orders.length > 0){
                ctx.editMessageText('<b>Все заявки</b>', {reply_markup: keyboards.ordersBuilder(orders), parse_mode: "HTML"})
            } else ctx.editMessageText('Нет заявок')
            break
        case 'active':
            orders = await db.orders.find({model: ObjectId(ctx.userData._id), status: 'active'}).toArray()
            if (orders.length > 0) {
                ctx.editMessageText('Активные заявки', {reply_markup: keyboards.ordersBuilder(orders), parse_mode: "HTML"})
            }  else ctx.editMessageText('Нет заявок')
            break
    }
     */


}