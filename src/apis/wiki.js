import request from '../utils/request';

// 获取配料wiki
function getWikiDetail(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/wiki/detail', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 后端图片安全检查接口
function imageSecCheck(filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('V1/image/sec-check/'),
            filePath: filePath,
            name: 'image',
            header: request.buildHeader({}),
            success: (uploadRes) => {
                resolve(uploadRes)
            },
            fail: (failRes) => {
                reject(failRes)
            }
        });
    })
}

export {
    getWikiDetail, imageSecCheck
}
