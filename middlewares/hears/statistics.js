module.exports = async ctx => {
    const db = await require('../../dbManager')

    switch (ctx.userData.role){
        case 'admin':
            ctx.reply(`
        Количество пользователей - ${await db.users.countDocuments()}
        `, {parse_mode: "HTML"})
            break
        case 'model':
            let statistics = ctx.userData.statistics
            ctx.reply(`
<b>Сет 1</b> -
    Фото - ${statistics['1'].photos}
    Видео -  ${statistics['1'].videos}
<b>Сет 2</b>  -
    Фото - ${statistics['2'].photos}
    Видео -  ${statistics['2'].videos}
<b>Сет 3</b> -
    Фото - ${statistics['3'].photos}
    Видео -  ${statistics['3'].videos}
<b>Сет 4</b>  -
    Фото - ${statistics['4'].photos}
    Видео -  ${statistics['4'].videos}
<b>Лайф</b> -
    Фото - ${statistics['ad'].photos}
    Видео -  ${statistics['ad'].videos}
            `, {parse_mode: "HTML"})

            break
        default:
            ctx.reply('<b>Недостаточно прав!</b>', {parse_mode: "HTML"})
    }
}