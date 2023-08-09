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

export {
    getWikiDetail
}
