const keyboards = require('../../keyboards')
const {ObjectId} = require("mongodb");
const bson = require("bson");
module.exports = async ctx => {
    const db = await require('../../dbManager')
    const role = ctx.userData.role
    const type = ctx.callbackQuery.data.split('|')[1]
    console.log(role, type, 'ddfghjhjkdfgghjkf')
    let orders
    switch (type) {
        case 'all':
            orders = await db.orders.find({
                model: role === 'model' ? ObjectId(ctx.userData._id) : {$type: 'objectId'},
            }).toArray()
            if (orders.length > 0) {
                ctx.editMessageText('<b>Все заявки</b>', {
                    reply_markup: keyboards.ordersBuilder(orders),
                    parse_mode: "HTML"
                })
            } else ctx.editMessageText('Нет заявок', {reply_markup: keyboards.onlyBack})
            break
        case 'active':
            orders = await db.orders.find({
                model: role === 'model' ? ObjectId(ctx.userData._id) :  {$type: 'objectId'},
                status: 'active'
            }).toArray()
            if (orders.length > 0) {
                ctx.editMessageText('Активные заявки', {
                    reply_markup: keyboards.ordersBuilder(orders),
                    parse_mode: "HTML"
                })
            } else ctx.editMessageText('Нет заявок', {reply_markup: keyboards.onlyBack})
            break
    }


}