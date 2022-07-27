const path = require('path')
const fs = require('fs')
const {google} = require('googleapis')
const axios = require("axios");
const {ObjectId} = require("mongodb");
const values = require("./values");
const downloader = require('./mtproto-downloader')

const CLIENT_ID = '213034555223-k28cma7f1be6gbps8ph9bbsol3li3d16.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04U7cGpSXkwFSCgYIARAAGAQSNwF-L9IrRViLAXAw4eBShKnO0rMrZymFvJX_cGmyLMJhtlJiZfGfydIQ7JZRh-AtDuc1KYAorio'

const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)
oauth2client.setCredentials({refresh_token: REFRESH_TOKEN})


module.exports.addOrderToSheet = async (order) => {

    console.log(order, 'before')
    order = Object.values(order).filter(x => typeof x !== "object")
    order = Object.values(order).map(x => x.toString())
    console.log(order, 'addOrderToSheet')

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })

    const client = await auth.getClient()
    const googleSheets = google.sheets({version: "v4", auth: client})

    const spreadsheetId = '1SHuAOJdfAon64k2O3c-1QgU2prFYYwO67CcrgJZmtWw'

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[...order]]
        }
    })
}


module.exports.contentUploader = async (files, ctx, order) => {
    const db = await require('./dbManager')
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/drive'
    })
    const drive = google.drive({
        version: 'v3',
        auth: auth
    })

    let name =  ctx.userData?.linkedModelData?.name || ctx.userData.name
    let folders = (await db.folders.findOne({folderName: name})) || null
    {
        //creating folder
        if (typeof ctx != "undefined" && ctx?.userData?.name) {
            if (folders === null) {
                console.log('creating new folder')
                let file
                folders = {}
                file = await drive.files.create({
                    resource: {
                        'name': name,
                        parents: [values.BOT_FOLDER_ID],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.main = file.data.id
                let base = await drive.files.create({
                    resource: {
                        'name': `Базовый контент`,
                        parents: [folders.main],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.base = base.data.id
                let ad = await drive.files.create({
                    resource: {
                        'name': `Рекламный контент`,
                        parents: [folders.main],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.ad = ad.data.id
                let custom = await drive.files.create({
                    resource: {
                        'name': `Кастомный контент`,
                        parents: [folders.main],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.custom = custom.data.id
                let set1 = await drive.files.create({
                    resource: {
                        'name': `Сет 1`,
                        parents: [folders.base],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.set1 = set1.data.id
                let set2 = await drive.files.create({
                    resource: {
                        'name': `Сет 2`,
                        parents: [folders.base],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.set2 = set2.data.id
                let set3 = await drive.files.create({
                    resource: {
                        'name': `Сет 3`,
                        parents: [folders.base],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.set3 = set3.data.id
                let set4 = await drive.files.create({
                    resource: {
                        'name': `Сет 4`,
                        parents: [folders.base],
                        'mimeType': 'application/vnd.google-apps.folder'
                    },
                    fields: 'id'
                })
                folders.set4 = set4.data.id
                db.folders.insertOne({model: ObjectId(ctx.userData._id), ...folders, folderName: name})

            }

        } else {
            return ctx.reply('Необходимо задать имя модели!')
        }
    }

    var folderID = ''
    if (order?.sort === 'custom') {
        folderID = folders.custom
    } else {
        console.log('xxxxxxddfhsksdfhjsdfkj', ctx.userData.temp.set)
        switch (ctx.userData.temp.set){
            case 1:
                console.log('setted oen ')
                folderID = folders.set1
                console.log(folderID, 'jkdfhdfhjk',folders.set1)
                break
            case 2:
                folderID = folders.set2
                break
            case 3:
                folderID = folders.set3
                break
            case 4:
                folderID = folders.set4
                break
            case 'ad':
                folderID = folders.ad
                break
        }
    }
    console.log(files, 'Файлы для загрузки!!')

    for (let file of files) {
        const localDate = (new Date(Date.now())).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: "numeric",
            minute: 'numeric'
        })
        let randomName = Math.random().toString().replace('.', '_')
        let filePath = path.resolve('data')+ '/' + randomName
        let extension = ''
        if (file.mimeType === 'image/jpeg') {
            extension = '.jpg'
            filePath += extension
            let url = await ctx.telegram.getFileLink(file.fileID)
            const fileStream = await axios({method: 'get', url, responseType: 'stream'})
            let fileWriteStream = await fs.createWriteStream(filePath)
            await fileStream.data.pipe(fileWriteStream)
            await new Promise(resolve => fileWriteStream.on('finish', () => resolve()))
        } else if (file.mimeType === 'video/mp4'){
            extension = '.mp4'
            filePath += extension
            await downloader(ctx.from.id, file.messageID, filePath)
        }

        let fileStreamFs = fs.createReadStream(filePath)
        let fileMetadata = {
            'name': localDate + extension,
            parents: [folderID]
        };
        const media = {
            mimeType: file.mimeType,
            body: fileStreamFs
        };
        await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        })
    }
    ctx.reply('Загрузка успешно завершена!')
}


