const dbManager = require('../dbManager')
const values = require('../values')


module.exports.readUserData = async (ctx, next) => {
    const userID = ctx.from.id
    const db = await dbManager
    let userData = await db.users.findOne({userID: userID})
    if (!userData) {
        userData = values.DEFAULT_USER_DATA
        userData.name = ctx.from.first_name
        userData.userID = userID
        if (values.ADMIN_IDS.includes(userID)) {
            userData.role = 'admin'
            await db.users.insertOne(userData)
        }
        //await db.users.insertOne(userData)

        ctx.reply(`<b>Ваш аккаунт не найден в базе, обратитесь к администратору для добавления аккаунта!</b>\nВаш ID - <code>${userID}</code>`, {parse_mode: "HTML"})

    } else {
        ctx.userData = userData
        next()
    }


}
module.exports.writeUserData = async (ctx, next) => {
    const userID = ctx.from.id
    const db = await dbManager
    db.users.replaceOne({userID: userID}, ctx.userData)
    //await users.updateOne({userID: userID}, ctx.userData)
}