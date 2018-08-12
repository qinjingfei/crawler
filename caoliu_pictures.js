const cheerio = require('cheerio')
const request = require('superagent');
require('superagent-charset')(request)
const fs = require('fs')
const util = require('./util')

let counter = 0
const baseUrl = 'http://t66y.com/'
const url = "http://t66y.com/thread0806.php?fid=8"
const ua = "Mozilla/5.0 (Linux; U; Android 4.0.4; en-gb; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"

// 输入url得到这个url的cherrio对象
async function getCherrio(url) {
    const response = await request
        .get(url)
        .charset('gbk')
        .accept('text')
        .set('User-Agent', ua)
    const text = response.text
    const $ = cheerio.load(text)
    return $
}

//获取url内selector中attribute属性的数组
async function getLinks(url, selector, attribute) {
    const $ = await getCherrio(url)
    const array = [];
    $(selector).each((index, item) => {
        array.push($(item).attr(attribute))
    })
    return util.uniq(array)
}

// 把url内容写入文件
function writeToFile(path, url) {
    const stream = fs.createWriteStream(path);
    request
        .get(url)
        .on('end', function(){
            console.log(`${path}  下载完成`)
        })
        .pipe(stream)
}

async function start() {
    const array = await getLinks(url, 'a[href^="htm_data"]', 'href')
    util.mkdir("image")
    array.slice(10, 15).forEach(async (link) => {
        let imageArray = await getLinks(baseUrl + link, 'input[type="image"]', 'data-src')
        imageArray.forEach( link => {
            counter++
            writeToFile(`./image/${counter}.jpg`, link) 
        })
    })
    return ''
}
start()