const values = require("../../values");
const keyboards = require("../../keyboards");
module.exports = async (ctx, next) => {
    if (values.ADMIN_IDS.includes(ctx.from.id) || ctx.userData.role === 'admin') {
        ctx.userData.position = 'users_list'
        ctx.reply('<b>Панель администратора</b>', {reply_markup: keyboards.adminPanel,  parse_mode: "HTML"})
    } else return ctx.reply('🚫У вас недостаточно прав для просмотра этого раздела!')
    console.log(ctx.userData)
    await require('../../middlewares/db').writeUserData(ctx)
}
