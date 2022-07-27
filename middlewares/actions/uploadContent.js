const keyboards = require("../../keyboards");
module.exports = (ctx, next) => {
    const ID = ctx.callbackQuery.data.split('|')[1]
    ctx.reply(`Отправьте весь контент и нажмите на кнопку подтверждения
ID заявки - ${ID}`)
    ctx.userData.uploadingOrderID = ID
    ctx.reply('Отправьте контент для загрузки!', {reply_markup: keyboards.uploading.resize()})
    ctx.scene.enter('upload-content-scene', {arguments: ID} )
    next()
}