/*
Scopes:
Yandex.Disk WebDAV API
Application access to Yandex.Disk

Yandex.Disk REST API
Writing in any place on Yandex.Disk

Read all of Yandex.Disk
Access to information about Yandex.Disk

Access to app folder in Yandex.Disk

ID: fd37a5581f4446eba5816d06ef33b226
Password: 9c137ebb92004399a8444c225788c15d
Callback URL:
TTL of token: At least 1 year
Date created: 14.05.2022
 */
/*

 */

const YandexDisk = require('yandex-disk').YandexDisk;
const {info, resources, recent, upload} = require('ya-disk')
const values = require("./values");
const {ObjectId} = require("mongodb");
const {recommender} = require("googleapis/build/src/apis/recommender");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const downloader = require("./mtproto-downloader");
const {parse} = require("url");
const {request} = require("https");

/*
ID: 866300e2e3e0462a858e8157d66f90a5
Пароль: d752f35792174b8c98590a964477b9f6
 */

const API_TOKEN = "AQAAAABg9TdJAAfpQ4nc-ibFf0pvt5Txixq0u5s";

const PATH_PREFIX = 'disk:/Бот/'
module.exports.yandexContentUploader = async (files, ctx, order) => {
    const db = await require('./dbManager')
    let name = ctx.userData?.linkedModelData?.name || ctx.userData.name
    let folders = (await db.folders.findOne({folderName: name})) || null
    { //Creating folder if not exist
        if (typeof ctx != "undefined" && ctx?.userData?.name) {
            if (folders === null) {
                console.log('creating new folder')
                folders = {}
                console.log('Stage 1')
                await resources.create(API_TOKEN, PATH_PREFIX + name).catch(console.error)
                folders.main = PATH_PREFIX + name
                console.log('Stage 2')
                await resources.create(API_TOKEN,`${folders.main}/Базовый контент`).catch(console.error)
                folders.base = `${folders.main}/Базовый контент`
                console.log('Stage 3')
                await resources.create(API_TOKEN, `${folders.main}/Рекламный контент`).catch(console.error)
                folders.ad = `${folders.main}/Рекламный контент`
                await resources.create(API_TOKEN, `${folders.main}/Кастомный контент`).catch(console.error)
                // SHIT FIX
                await resources.create(API_TOKEN, `${folders.main}/Кастомный контент`).catch(console.error)
                folders.custom = `${folders.main}/Кастомный контент`
                await resources.create(API_TOKEN, `${folders.base}/Сет 1`).catch(console.error)
                folders.set1 = `${folders.base}/Сет 1`
                await resources.create(API_TOKEN, `${folders.base}/Сет 2`).catch(console.error)
                folders.set2 = `${folders.base}/Сет 2`
                await resources.create(API_TOKEN, `${folders.base}/Сет 3`).catch(console.error)
                folders.set3 = `${folders.base}/Сет 3`
                await resources.create(API_TOKEN, `${folders.base}/Сет 4`).catch(console.error)
                folders.set4 = `${folders.base}/Сет 4`
                // SHIT FIX
                await resources.create(API_TOKEN, `${folders.main}/Кастомный контент`).catch(console.error)
                db.folders.insertOne({model: ObjectId(ctx.userData._id), ...folders, folderName: name})
            }
        } else {
            return ctx.reply('Необходимо задать имя модели!')
        }
    }

    var folderPath = ''
    if (order?.sort === 'custom') {
        folderPath = folders.custom
    } else {
        switch (ctx.userData.temp.set) {
            case 1:
                folderPath = folders.set1
                console.log(folderPath, 'jkdfhdfhjk', folders.set1)
                break
            case 2:
                folderPath = folders.set2
                break
            case 3:
                folderPath = folders.set3
                break
            case 4:
                folderPath = folders.set4
                break
            case 'ad':
                folderPath = folders.ad
                break
        }
    }
    console.log(files, 'Файлы для загрузки!!')
    let index = 0
    for (let file of files) {
        index++
        const localDate = (new Date(Date.now())).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: "numeric",
            minute: 'numeric'
        })
        let randomName = Math.random().toString().replace('.', '_')
        let filePath = path.resolve('data') + '/' + randomName
        let extension = ''
        if (file.mimeType === 'image/jpeg') {
            extension = '.jpg'
            filePath += extension
            let url = await ctx.telegram.getFileLink(file.fileID)
            const fileStream = await axios({method: 'get', url, responseType: 'stream'})
            let fileWriteStream = await fs.createWriteStream(filePath)
            await fileStream.data.pipe(fileWriteStream)
            await new Promise(resolve => fileWriteStream.on('finish', () => resolve()))
        } else if (file.mimeType === 'video/mp4') {
            extension = '.mp4'
            filePath += extension
            await downloader(ctx.from.id, file.messageID, filePath)
        }
        let fileStreamFs = fs.createReadStream(filePath)
        const fileName =  localDate + ` (${index})` + extension
        const {href, method} = await upload.link(API_TOKEN, `${folderPath}/${fileName}`);
        const uploadStream = request({...parse(href), method});

        fileStreamFs.pipe(uploadStream)
        await new Promise(resolve => {
            fileStreamFs.on('end', () => {
                uploadStream.end()
                resolve()
            })
        })
    }
    ctx.reply('Загрузка успешно завершена!')
}


/*
async function load() {
    // console.log(await info(API_TOKEN))
    console.log(await resources.create(API_TOKEN, PATH_PREFIX + 'Test9'))
}
load()
 */

