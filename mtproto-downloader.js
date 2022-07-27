const {Api, TelegramClient} = require("telegram");
const {StringSession} = require("telegram/sessions");
const {TOKEN, API_ID, API_HASH} = require("./values")
const fs = require("fs");
const session = new StringSession(""); // You should put your string session here
const client = new TelegramClient(session, API_ID, API_HASH, {});


async function download(userID, messageID, filePath) {
    return new Promise(async (resolve, reject) => {
        const result = await client.getMessages(userID.toString(), {
            ids: messageID // the id of the message you want to download
        });
        if (!result[0]) return reject()
        if (!result[0]?.media) return reject()

        const media = result[0].media;
        if (media) {
            let buffer = await client.downloadMedia(media, {});
            let writeStream = fs.createWriteStream(filePath)
            writeStream.write(buffer)
            writeStream.close()
            await new Promise(resolve => writeStream.on('finish', () => resolve()))
            resolve(buffer)
        } else {
            reject()
        }
    })
}


client.start({botAuthToken: TOKEN}).then(() => {
    /*
    let messageID = 7606
    let userID = 1560854919
    let fileName = '1560854919.jpg'
    console.log('Downloading...')
    main(userID, messageID, fileName).then(()=>{
        console.log('Downloaded')
    })
     */
})

module.exports = download