import Config from "@/config/config";
import {loading} from "@/utils/global";


// 获取百度access_token
function getBaiduToken() {
    return new Promise(resolve => {
        let apiKey = Config.apiKey
        let secretKey = Config.secretKey
        let tokenUrl = Config.baiduTokenUrl+`?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`

        uni.request({
            url: tokenUrl,
            method: 'POST',
            dataType: 'json',
            header: {
                'content-type': 'application/json; charset-UTF-8'
            },
            success: function (res) {
                console.log("getBaiduToken()获取成功", res);
                return resolve(res)
            },
            fail: function (res) {
                console.log("BaiduToken()获取失败", res);
                return resolve(res)
            }
        })
    })
}

// 用base64字符编码获取图片的内容
function getImgInfoBase64(tempFilePath, value) {
    let that = this
    loading('识别中...');
    return new Promise(resolve => {

        // 获取token
        getBaiduToken().then(res => {
            const token = res.data.access_token
            uni.getFileSystemManager().readFile({
                filePath: tempFilePath,
                encoding: 'base64',
                success: function (res) {
                    const detectUrl = Config.baiduApiBaseUrl + value + '?access_token=' + token
                    uni.request({
                        url: detectUrl,
                        data: {
                            image: res.data,
                            id_card_side: 'front', // 文字识别中身份证识别特有参数
                            baike_num: 1           // 图片识别中返回百科信息
                        },
                        method: 'POST',
                        dataType: 'json',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res, reso) {
                            // 处理ocr数据，进行正则匹配截取
                            console.log('成功：', res)
                            return resolve(res)
                        },
                        fail: function (res, reject) {
                            console.log('fail getImgInfo()：', res.data);
                        },
                        complete: function () {
                            loading(false)
                        }
                    })
                },
            })
        })
    })
}

function getImgInfoMultipart(tempFilePath, value) {
    let that = this
    loading('识别中...');
    return new Promise(resolve => {

        // 获取token
        getBaiduToken().then(res => {
            const token = res.data.access_token
            const detectUrl = Config.baiduApiBaseUrl + value + '?access_token=' + token

            uni.uploadFile({
                url: detectUrl,
                filePath: tempFilePath,
                name: 'image',
                formData: {
                    from: 'auto',
                    to: 'zh',
                    v: 3,
                    paste: 0,
                },
                success: function (res, reso) {
                    // 处理ocr数据，进行正则匹配截取
                    console.log('成功：', res)
                    return resolve(res)
                },
                fail: function (res, reject) {
                    console.log('fail getImgInfoMultipart()：', res.data);
                },
                complete: function () {
                    loading(false)
                }
            })
        })
    })
}

export { getBaiduToken, getImgInfoBase64, getImgInfoMultipart }