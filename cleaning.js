const values = require('./values')

const {Telegraf} = require("telegraf")
const fs = require("fs")

async function remover() {
    try {
        fs.unlinkSync("database.json")
        fs.unlinkSync("db.sqlite3")
        //   fs.unlinkSync("channels.json")
    } catch {
        console.log("err")
    }

    basicJSON = {
        "poolSize": 0.0,
        "tickets": []
    }
    fs.writeFileSync('./DATA/data.json', JSON.stringify(basicJSON, null, 2))
}

remover()
console.log(process.env.BOT_TOKEN)
const bot = new Telegraf(values.BOT_TOKEN)

setTimeout(bot.launch, 10000)