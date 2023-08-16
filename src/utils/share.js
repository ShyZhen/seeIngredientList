function getShareObj(res) {
    return {
        title: getShareMessage(),
        path: '/pages/index/index',
        desc: '图像AI识别大师,图文识别|拍照翻译|拍照识花|身份证银行卡|营业执照|植物动物水果蔬菜|你想要的功能我都有！',
        success(res) {
        },
        fail(res) {
        }
    }
}

function getShareMessage() {
    let messages = [{
        title: '图像AI识别大师,图文识别|拍照翻译|识花草|知动物|身份证|银行卡',
    },{
        title: '图像AI识别大师,图文识别|拍照翻译|识花草|知动物|身份证|银行卡',
    }];

    return messages[Math.floor(Math.random()*messages.length)]['title'];
}


export {
    getShareObj
}
