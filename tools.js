/*


const {Telegraf} = require("telegraf")
const fs = require('fs')
const values = require("./values")

const bot = new Telegraf(values.BOT_TOKEN)
const db = require('./dbManager')

// Remove shit equals  $ rm -rf /
// Fuck json

function notifyAdmins(text) {
    for (const userId of values.ADMIN_IDS) {
        bot.telegram.sendMessage(userId, text)
    }
}

module.exports.notifyAdminsWithUserContext = async function (userID, text) {
    const userInfo = await bot.telegram.getChat(userID)
    const userData = db.getUserData(userID)
    console.log(userInfo)
    notifyAdmins(`
${text}

Имя: ${userInfo.first_name}
Никнейм: @${userInfo.username}
Баланс: ${db.getUserBalance(userID)} BTC
Активных билетов:  ${userData?.ticketsCount} 
Всего куплено билетов: ${userData?.allTimeBoughtTickets}
`)
}


module.exports.notifyAdmins = notifyAdmins
module.exports.generateLotteryTicket = function () {
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    let codes = fs.readFileSync("codes.json")
    var json = JSON.parse(codes)
    json.list.push(code)
    fs.writeFileSync("codes.json", JSON.stringify(json, undefined, 2))
    return code
}
module.exports.checkTicket = function (code) {
    let codes = fs.readFileSync("codes.json")
    var json = JSON.parse(codes)
    let counter = 0
    for (const channel of json.list) {
        if (channel === code) {
            console.log('found')
            json.list.pop(counter)
            fs.writeFileSync("codes.json", JSON.stringify(json, undefined, 2))
            return true
        }
        counter++
    }
    fs.writeFileSync("codes.json", JSON.stringify(json, undefined, 2))
    return false
}
module.exports.addChannel = function (channel_id, channel_name) {
    console.log("adding, channel")
    let channels = fs.readFileSync("channels.json")
    var json = JSON.parse(channels)
    console.log(json)
    json.list.push({id: channel_id, name: channel_name})
    fs.writeFileSync("channels.json", JSON.stringify(json, undefined, 2))
}
module.exports.removeChannel = function (channel_id) {
    console.log("removing, channel")
    let channels = fs.readFileSync("channels.json")
    var json = JSON.parse(channels)
    let counter = 0
    for (const channel of json.list) {
        if (channel_id === channel.id) {
            json.list.pop(counter)
        }
        counter++
    }
    console.log(json)
    fs.writeFileSync("channels.json", JSON.stringify(json, undefined, 2))
}
module.exports.getChannels = function get_channels() {
    let channels = fs.readFileSync("channels.json")
    var json = JSON.parse(channels)
    console.log(json)
    return json.list
}
module.exports.addUser = function add_user(user_id) {
    console.log("adding, useer")
    let users = fs.readFileSync("users.json")
    var json = JSON.parse(users)
    console.log(json)
    json.list.push({user_id: userId, btcAddress: "none"})
    fs.writeFileSync("users.json", JSON.stringify(json, undefined, 2))
}
module.exports.addUserWallet = function (user_id, wallet) {
    console.log("adding user wallet", user_id, wallet)
    let users = fs.readFileSync("users.json")
    var json = JSON.parse(users)
    console.log(json)
    for (let n = 0; n < json.list.length; n++) {
        console.log("(#(##")
        if (json.list[n].user_id === user_id) {
            json.list[n].btc_adress = wallet
            console.log(json.list[n].btc_adress)
            console.log(wallet, 9090)
        }
    }
    console.log(json)
    fs.writeFileSync("users.json", JSON.stringify(json, undefined, 2))
}
module.exports.getWinner = function get_winner() {
    let users = fs.readFileSync("users.json")
    let user_to_return = ""
    const items = JSON.parse(users).list

    const item = items[Math.floor(Math.random() * items.length)]
    return item
}
module.exports.getCustomWinner = function (userId) {
    let users = fs.readFileSync("users.json")
    let userToReturn = ""

    const items = JSON.parse(users).list
    console.log(items)
    for (const item of items) {
        console.log(item)
        console.log(userId)
        if (item.userId === userId) {
            console.log("OOK")
            return item
        }
    }
    return false
}
module.exports.getUsers = function () {
    let users = fs.readFileSync("users.json")
    let textToReturn = ""
    for (item of JSON.parse(users).list) {
        console.log(item)
        textToReturn = textToReturn + "User ID " + item.userId + " " + item.btcAddress + "\n"

    }
    return textToReturn
}


 */