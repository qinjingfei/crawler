const fs = require('fs')

exports.mkdir = function(_path) {
    if (fs.existsSync(_path)) {
        console.log(`${_path}目录已存在`)
    } else {
        fs.mkdir(_path, (error) => {
            if (error) {
                return console.log(`创建${_path}目录失败`);
            }
            console.log(`创建${_path}目录成功`)
        })
    }
}

exports.uniq = function (array) {
    return array.filter((item, index)=> array.indexOf(item) === index)
}