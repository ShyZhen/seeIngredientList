import Config from "@/config/config";


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

export { getBaiduToken }