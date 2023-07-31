import request from '../utils/request';

// 获取文章列表
function getTimelineList(type, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/timeline/list/'+type+'?page='+page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取文章详情
function getTimelineDetail(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/timeline/detail/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 创建文章
function createTimeline(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/timeline/created', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 上传图片(二进制)
function uploadImage(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/file/image', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 上传图片(uniapp通用方式)
// 小程序只支持一张一张传，循环调用
function uniUploadImage(filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('/V1/file/image'),
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
function updateAvatar(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/file/avatar', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}
function uniUploadImageAvatar(filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('/V1/file/avatar'),
            filePath: filePath,
            name: 'avatar',
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

// 删除自己的文章
function deleteTimeline(uuid) {
    return new Promise((resolve, reject) => {
        request.request('DELETE', 'V1/timeline/delete/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 某用户发布的所有文章(包括自己)
function getUserTimelines(userUuid, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/timeline/user-timeline/' + userUuid +'?page='+page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 收藏文章、回答、视频
function getMyCollected(type, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/collection/' + type +'?page='+page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 举报
function report(uuid) {
    return new Promise((resolve, reject) => {
        request.request('PUT', 'V1/timeline/report/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 问题与反馈
function reportApp(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/report', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    getTimelineList, uploadImage, getTimelineDetail, createTimeline, deleteTimeline, uniUploadImage, getUserTimelines, report, getMyCollected,
    uniUploadImageAvatar, reportApp
}
