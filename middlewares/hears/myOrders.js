const keyboards = require('../../keyboards')
module.exports = async (ctx, next)  => {
    ctx.userData.position = 'my_orders'
    ctx.reply('<b>Выберете тип заявки</b>', {reply_markup: keyboards.orderTypes, parse_mode: "HTML"})
    next()
}