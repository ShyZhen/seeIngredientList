import request from '../utils/request';

function getAllComment(uuid, type, sort, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/comment/' + type +  '/' + uuid + '/'  + sort + '?page=' + page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function createComment(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/comment', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    getAllComment, createComment
}