const keyboards = require('../keyboards')
const Telegraf = require("telegraf");
const {ObjectId} = require("mongodb");
const isUrl = require('is-url')

const google = require('../google')
const logic = require("../logic");
const {yandexContentUploader} = require("../yandex");

/*
async function getTypeFromMessage(message){
    switch (message){

    }
}
 */

async function createIfNotExist(userID){
    const db = await require('../dbManager')
    await db.usersExtra.insertOne({userID}, {...{loader: []}}, ()=>{}, {upsert: true})
    db.usersExtra.updateMany({'loader': {$exists : false}}, {$set: {'loader': []}})
}

async function addToFileLoader(userID, file) {
    const db = await require('../dbManager')
    await db.usersExtra.updateOne({userID}, {$push: {loader: file}})
}

async function clearFileLoader(userID) {
    const db = await require('../dbManager')
    await db.usersExtra.updateOne({userID}, {$set: {loader: []}})
}


async function getFileLoader(userID) {
    const db = await require('../dbManager')
    return (await db.usersExtra.findOne({userID})).loader
}

module.exports.getContent = async (ctx, next) => {
    let userID = ctx.userData?.linkedModelData?.userID || ctx.from.id
    const db = await require('../dbManager')

    await createIfNotExist(userID)
    if (!ctx.message) return next()

    switch (ctx.message?.text) {
        case '❌Отменить загрузку':
            ctx.reply('Меню модели', {reply_markup: keyboards.mainModel})
            await clearFileLoader(userID)
            ctx.scene.leave()
            break
        case '✔️Подтвердить отправку':
            ctx.reply('Загружка файлов в Yandex Disk начата')
            switch (ctx.userData.role) {
                case "model":
                    ctx.reply('Меню модели', {reply_markup: keyboards.mainModel})
                    break
                case "photographer":
                    ctx.reply(`Меню фотографа\nПривязана модель: ${ctx.userData?.linkedModelData.name}`, {reply_markup: keyboards.mainPhotographer})
                    break
            }


            let order = await db.orders.findOne({_id: ObjectId(ctx.userData.uploadingOrderID)})
            let loader = await getFileLoader(userID)
            await clearFileLoader(userID)
            console.log('2222 loaderis', loader)
            if (order?.operatorID) {
                ctx.telegram.sendMessage(order.operatorID, `Заявка модели ${order.modelData.name} исполнена!`)
                const profit = logic.calculateProfit(order)
                //ctx.reply(`Расчетный доход за загрузку ${profit}`)
                ctx.userData.statistics.profit += profit
            }
            // ___SHITCODE FIX___
            await yandexContentUploader(loader, ctx, order)

            // ___SHITCODE FIX___
            if (ctx.userData.uploadingOrderID) {
                let objectId = ObjectId(ctx.userData.uploadingOrderID)
                const profit = logic.calculateProfit(order)
                let timeSpent = Math.floor(Date.now() / 1000) - order.createTime
                db.orders.updateOne({_id: objectId}, {$set: {status: 'done'}})
                db.orders.updateOne({_id: objectId}, {$set: {paid: profit}})
                db.orders.updateOne({_id: objectId}, {$set: {timeSpent: `${Math.round(timeSpent / 3600)} часов`}})
                db.orders.updateOne({_id: objectId}, {$set: {doneDate: Date.now()}})
            }
            ctx.userData.uploadingOrderID = null



            let photosCount =loader.filter(e => e.mimeType === 'image/jpeg').length
            let videosCount = loader.filter(e => e.mimeType !== 'image/jpeg').length
            if (ctx.userData?.linkedModelData?.userID) {
                let statistics = (await db.users.findOne({userID})).statistics
                if (typeof statistics[ctx.userData.temp.set]?.photos === "undefined") {
                    statistics[ctx.userData.temp.set] = {photos: 0, videos: 0}
                }
                statistics[ctx.userData.temp.set] = statistics[ctx.userData.temp.set] || {photos: 0, videos: 0}
                statistics[ctx.userData.temp.set].photos += photosCount
                statistics[ctx.userData.temp.set].videos += videosCount
                db.users.updateOne({userID}, {$set: {statistics}})
            } else {
                if (typeof ctx.userData?.statistics[ctx.userData.temp.set]?.photos === "undefined") {
                    ctx.userData.statistics[ctx.userData.temp.set] = {photos: 0, videos: 0}
                }
                if (order) {
                    if (typeof ctx.userData.statistics?.base?.photos === "undefined") {
                        ctx.userData.statistics[ctx.userData.temp.set] = {photos: 0, videos: 0}
                    }
                    ctx.userData.statistics.base = ctx.userData.statistics.base || {photos: 0, videos: 0}
                    ctx.userData.statistics.base.photos += photosCount
                    ctx.userData.statistics.base.videos += videosCount
                } else {

                    ctx.userData.statistics[ctx.userData.temp.set] = ctx.userData.statistics[ctx.userData.temp.set] || {
                        photos: 0,
                        videos: 0
                    }
                    ctx.userData.statistics[ctx.userData.temp.set].photos += photosCount
                    ctx.userData.statistics[ctx.userData.temp.set].videos += videosCount
                }
            }
            // call load functio
            ctx.scene.leave()
    }
    if (ctx.message?.photo || ctx.message?.video || ctx.message?.document) {
        if (ctx.message?.document) {
            const fileID = ctx.message.document.file_id
            const mimeType = ctx.message.document.mime_type
            await addToFileLoader(userID, {...{fileID, mimeType, messageID: ctx.message.message_id}})
        }
        if (ctx.message?.photo) {
            const fileID = ctx.message.photo[ctx.message.photo.length - 1].file_id
            const mimeType = 'image/jpeg'
            await addToFileLoader(userID, {...{fileID, mimeType,  messageID: ctx.message.message_id}})
        }
        if (ctx.message?.video) {
            const fileID = ctx.message.video.file_id
            const mimeType = 'video/mp4'
            await addToFileLoader(userID, {...{fileID, mimeType,  messageID: ctx.message.message_id}})
        }

        ctx.reply('Загружено')
    }
    next()

}