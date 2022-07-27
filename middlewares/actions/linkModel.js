const {ObjectId} = require("mongodb");
module.exports = async (ctx, next) => {
    const db = await require('../../dbManager')
    const ID = ctx.callbackQuery.data.split('|')[1]

    if (ID && ctx.userData.role === 'photographer') {
        ctx.userData.linkedModelData = await db.users.findOne({_id: ObjectId(ID)})
            .then(data => {
                if (data){
                    ctx.editMessageText('Модель успешно првязана!')
                    return data
                } else ctx.editMessageText('Модель не найдена!')
                return null
            })
            .catch(() => ctx.editMessageText('Ошибка'))
        next()
    } else ctx.editMessageText('Ошибка, вы не фотограф или ID не задан.')
}