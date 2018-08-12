const cheerio = require('cheerio')
const request = require('superagent');
require('superagent-charset')(request)
const fs = require('fs')

const url = "https://www.javbus.com/"
const ua = []
ua.push("Mozilla/5.0 (Linux; U; Android 4.0.4; en-gb; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30")
ua.push("Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19")
ua.push("Mozilla/5.0 (Linux; U; Android 2.2; en-gb; GT-P1000 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1")
let i = 0

function getHtml(url, ua) {
    return request
        .get(url)
        .accept('text')
        .set('User-Agent', ua)
        .then(res => res.text)
        .then(text => cheerio.load(text))
}

getHtml(url, ua[0])
    .then($ => {
        const array = []
        $('a.movie-box').each((index, item) => {
            array.push($(item).attr('href'))
        })
        console.log(array)
        return array
    })
    .then(array => {
        array.forEach(item =>
            getHtml(item, ua[2])
                .then($ => {
                    const array = []
                    $('a[href^="magnet:?xt=urn:btih:"]').each((index, item) => {
                        array.push($(item).attr('href'))
                    })
                    console.log(array)
                    return array
                })
        )
    })