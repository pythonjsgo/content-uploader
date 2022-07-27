const keyboards = require('../../keyboards')
module.exports = async ctx => {
    const db = await require('../../dbManager')()
    if (ctx.userData.role === 'operator') {
        let models = await db.users.find({role: 'model'}).toArray()
        if (models.length > 0) {
            ctx.reply(`<b>Выберете модель из списка</b>
Найдено моделей - ${models.length}`, {
                reply_markup: await keyboards.modelsBuilder(models),
                parse_mode: "HTML"
            })
        } else {
            ctx.reply('<b>Модели не найдены!</b>', {parse_mode: "HTML"})
        }
    } else {
        ctx.reply('<b>Недостаточно прав!</b>', {parse_mode: "HTML"})
    }
}
/*
Команда отправляет запрос
на кастомное видео
для определенной модели по форме:
1. Модель
2. Видео/фото.
3. Количество минут/количество фото
4. Подпобный сценарий кастома.
5. Ссылка на мембера, кто заказал кастом
6. Ваше имя/Ник в тг (того, кто взял кастом)
7.Цена за кастом

 */