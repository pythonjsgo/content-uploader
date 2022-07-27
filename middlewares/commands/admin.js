const values = require('../../values')
const keyboards = require('../../keyboards')
const db = require('../../dbManager')
module.exports = ctx => {
    if (values.ADMIN_IDS.includes(ctx.from.id) || ctx.userData.role === 'admin') {
        ctx.reply('<b>Панель администратора</b>', {reply_markup: keyboards.adminPanel,  parse_mode: "HTML"})
    } else return ctx.reply('🚫У вас недостаточно прав для просмотра этого раздела!')

}