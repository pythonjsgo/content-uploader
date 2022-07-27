const keyboards = require('../../keyboards')

module.exports = async (ctx, next) => {
    const db = await require('../../dbManager')
    ctx.userData.position = 'my_orders'
    ctx.reply('<b>Выберете тип заявки</b>', {reply_markup: keyboards.orderTypes, parse_mode: "HTML"})
    next()
    /*
    let orders
    switch (ctx.userData.role) {
        case "admin":
            orders = await db.orders.find().toArray()
            ctx.reply('Список заявок', {reply_markup: keyboards.ordersBuilder(orders)})
            break
        case "operator":
            orders = await db.orders.find({operatorID: ctx.from.id}).toArray()
            ctx.reply('Список заявок', {reply_markup: keyboards.ordersBuilder(orders)})
            break
    }

     */


}