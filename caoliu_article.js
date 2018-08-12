const cheerio = require('cheerio')
const request = require('superagent');
require('superagent-charset')(request)
const fs = require('fs')
const util = require('./util')

const baseUrl = 'http://t66y.com/'
const url = "http://t66y.com/thread0806.php?fid=20"
const ua = "Mozilla/5.0 (Linux; U; Android 4.0.4; en-gb; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
const links = []

// function getNextPage(url) {
//     return getHtml(url, ua)
//         .then(text => cheerio.load(text))
//         .then($ => {
//             nextUrl = baseUrl + $('a.w70+a[href^="thread"]').attr('href')
//             console.log(nextUrl)
//         })
        
// }

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

//获取url内selector中text的数组
async function getContent(url) {
    const $ = await getCherrio(url)
    const title =  $('h4').text()
    const content = $('div.tpc_content').text().split('　　').join('\r\n  ') //把<br>换成\r\n, 并在段落开头加入两个空格
    writeToFile(`./txt/${title}.txt`, content)
    return ''
}

// 把内容写入文件
function writeToFile(path, content) {
    const stream = fs.createWriteStream(path);
    stream.on('end', function(){
        console.log(`${path} 下载完成`)
    })
    stream.write(content)
    stream.end()
}

async function start() {
    const array = await getLinks(url, 'a[href^="htm_data"]', 'href')
    util.mkdir("txt")
    array.slice(5).forEach(link => {
        getContent(baseUrl+link)
    })
    return ''
}
start()