const {ObjectId} = require("mongodb");
const keyboards = require('../../keyboards')
module.exports = async ctx => {

    const db = await require('../../dbManager')
    const ID = ctx.callbackQuery.data.split('|')[1]

    if (ID && ctx.userData.role) {
        let order = await db.orders.findOne({_id: ObjectId(ID)})
        switch (order.type) {
            case 'photo':
                if (ctx.userData.role === "model"){
                    ctx.editMessageText(
                        (() => ctx.userData.role === 'admin' ? `<b>Модель</b> <a href="tg://user?id=${order.modelData.userID}"> ${order.modelData.name} </a>\n` : '')() +
                        `Дата: ${(new Date(order.creationTime * 1000)).toLocaleDateString('ru-RU')}
Тип - фото
Количество фото - ${order.count}
Сценарий - ${order.script}
Ссылка на мембера - ${order.memberUrl}
`, {
                            reply_markup: ctx.userData.role === 'model' ? keyboards.uploadContentBuilder(ID) : keyboards.adminOrderBuilder(ID),
                            parse_mode: "HTML"
                        })
                } else ctx.editMessageText(
                    (() => ctx.userData.role === 'admin' ? `<b>Модель</b> <a href="tg://user?id=${order.modelData.userID}"> ${order.modelData.name} </a>\n` : '')() +
                    `Дата: ${(new Date(order.creationTime * 1000)).toLocaleDateString('ru-RU')}
Тип - фото
Количество фото - ${order.count}
Сценарий - ${order.script}
Ссылка на мембера - ${order.memberUrl}
Цена - ${order.price}
`, {
                        reply_markup: ctx.userData.role === 'model' ? keyboards.uploadContentBuilder(ID) : keyboards.adminOrderBuilder(ID),
                        parse_mode: "HTML"
                    })
                break
            case 'video':
                if (ctx.userData.role === "model"){
                    ctx.editMessageText(
                        (() => ctx.userData.role === 'admin' ? `<b>Модель</b> <a href="tg://user?id=${order.modelData.userID}"> ${order.modelData.name} </a>\n` : '')() +
                        `Дата: ${(new Date(order.creationTime * 1000)).toLocaleDateString('ru-RU')}
Тип - видео
Длительность - ${order.count} мин.
Сценарий - ${order.script}
Ссылка на мембера - ${order.memberUrl}
`, {
                            reply_markup: ctx.userData.role === 'model' ? keyboards.uploadContentBuilder(ID) : keyboards.adminOrderBuilder(ID),
                            parse_mode: "HTML"
                        })
                } else ctx.editMessageText(
                    (() => ctx.userData.role === 'admin' ? `<b>Модель</b> <a href="tg://user?id=${order.modelData.userID}"> ${order.modelData.name} </a>\n` : '')() +
                    `Дата: ${(new Date(order.creationTime * 1000)).toLocaleDateString('ru-RU')}
Тип - видео
Длительность - ${order.count} мин.
Сценарий - ${order.script}
Ссылка на мембера - ${order.memberUrl}
Цена - ${order.price}
`, {
                        reply_markup: ctx.userData.role === 'model' ? keyboards.uploadContentBuilder(ID) : keyboards.adminOrderBuilder(ID),
                        parse_mode: "HTML"
                    })


                break
        }

    }

}