const {ObjectId} = require("mongodb");
module.exports = async ctx => {
    const db = await require('../../dbManager')
    const modelID = ctx.callbackQuery.data.split('|')[1]

    if (modelID && ctx.userData.role === 'operator'){
        let modelData = await db.users.findOne({_id: ObjectId(modelID)})
    }
}