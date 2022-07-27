const {Markup} = require("telegraf");

/*
module.exports.mainAdmin = Markup.inlineKeyboard([
        [Markup.callbackButton('Добавить', `topUpAccept`)],
        [Markup.callbackButton('Удалить', `cancelTopUp`)],
        [Markup.callbackButton('Статистика', `cancelTopUp`)]
])
 */
const backButton = [Markup.callbackButton('Назад', 'back')]

module.exports.onlyBack = Markup.inlineKeyboard(backButton)
module.exports.mainAdmin = Markup.keyboard([
    ['✉Показать заявки'],
    ['🪄Управление пользователями'],
    ['📊Статистика'],
]).resize()



module.exports.mainOperator = Markup.keyboard([
    ['✉Показать заявки'],
    ['💖Новая заявка'],
]).resize()

module.exports.mainModel = Markup.keyboard([
    ['💖Загрузить контент'],
    ['✨Мои заявки'],
    ['📊Статистика']
]).resize()

module.exports.mainPhotographer = Markup.keyboard([
    ['🔗Привязать модель'],
    ['💖Загрузить контент']
]).resize()



module.exports.modelsBuilder = models => {
    let buttons = []
    for (const model of models) {
        buttons.push([Markup.callbackButton(model.name, `select_model|${model._id}`)])
    }
    return Markup.inlineKeyboard(buttons)
}
module.exports.linkModelsBuilder = models => {
    let buttons = []
    for (const model of models) {
        buttons.push(Markup.callbackButton(model.name, `link_model|${model._id}`))
    }
    return Markup.inlineKeyboard(buttons)
}

module.exports.adminOrderBuilder = ID => {
    let buttons = []
    buttons.push([Markup.callbackButton(`❌Удалить`, `delete_order|${ID}`)])
    buttons.push(backButton)
    return Markup.inlineKeyboard(buttons)
}

module.exports.ordersBuilder = orders => {
    let buttons = []
    for (const order of orders) {
        let date = new Date(order.creationTime * 1000)
        buttons.push([Markup.callbackButton(date.toLocaleDateString('ru-RU'), `select_order|${order._id}`)])
    }
    buttons.push(backButton)
    return Markup.inlineKeyboard(buttons)
}

module.exports.orderTypes = Markup.inlineKeyboard([
    [Markup.callbackButton('Все', 'orders_list|all')],
    [Markup.callbackButton('Активные', 'orders_list|active')],
])

module.exports.photoOrVideo = Markup.inlineKeyboard(
    [
        [Markup.callbackButton('Фото', `photo`)],
        [Markup.callbackButton('Видео', `video`)],
    ]
)

module.exports.uploadContentBuilder = orderID => {
    return Markup.inlineKeyboard(
        [
            [Markup.callbackButton('Загрузить контент', `upload_content|${orderID}`)],
        ]
    )
}

module.exports.adminPanel = Markup.inlineKeyboard([
    [Markup.callbackButton('Показать пользователей', 'show_users')],
    [Markup.callbackButton('Добавить пользователя', 'add_user')],
    [Markup.callbackButton('Удалить пользователя', 'remove_user_choice')],


])

module.exports.contentSorts = Markup.inlineKeyboard([
    [Markup.callbackButton('Кастомный', 'custom')],
])
module.exports.roles = Markup.inlineKeyboard([
    [Markup.callbackButton('Модель', 'model')],
    [Markup.callbackButton('Оператор', 'operator')],
    [Markup.callbackButton('Фотограф', 'photographer')]
])
module.exports.uploading = Markup.keyboard([
    ['❌Отменить загрузку'],
    ['✔️Подтвердить отправку']
])
module.exports.sets = Markup.inlineKeyboard([
    [Markup.callbackButton('Сет 1', 'set_1')],
    [Markup.callbackButton('Сет 2', 'set_2')],
    [Markup.callbackButton('Сет 3', 'set_3')],
    [Markup.callbackButton('Сет 4', 'set_3')],
    [Markup.callbackButton('Рекламный', 'ad')],
    backButton
])

module.exports.usersBuilder = users => {
    let buttons = []
    for (const user of users) {
        buttons.push([Markup.callbackButton(user.name, `|${user._id}`)])
    }
    buttons.push(backButton)
    return Markup.inlineKeyboard(buttons)
}
module.exports.usersDeleteBuilder = users => {
    let buttons = []
    for (const user of users) {
        if (user.role === 'admin') {
            buttons.push([Markup.callbackButton(`🔒${user.name}`, `|${user._id}`)])
            continue
        }
        buttons.push([Markup.callbackButton(`❌${user.name}`, `delete_user|${user._id}`)])
    }
    buttons.push(backButton)
    return Markup.inlineKeyboard(buttons)
}