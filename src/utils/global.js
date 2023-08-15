import {imageSecCheck} from "@/apis/wiki";
import Config from "../config/config";

// 加载层
function loading(text, config) {
    if (text === false) {
        uni.hideLoading();
    } else {
        text = text || '';
        let options = Object.assign({
            title: text,
            mask: true,
        }, config || {});
        uni.showLoading(options);
    }
}

// 弹窗
function toast(text, config) {
    // 防止由于loading的关闭导致toast关闭
    loading(false)
    let options = Object.assign({
        title: text,
        icon: 'none',
        duration: 2000,
    }, config || {});
    uni.showToast(options);
}

// 跳转到登录
function toLogin() {
    uni.navigateTo({
        url: '../login/login'
    });
}

// 登录成功后刷新数据跳回当前页面
function reLunchBack() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 2];
    if (currPage) {
        if (currPage.route === 'pages/article/details') {
            uni.reLaunch({
                url: '/pages/article/article'
            });
        } else {
            uni.reLaunch({
                url: '/' + currPage.route
            });
        }
    } else {
        toHome()
    }
}

function toHome() {
    uni.switchTab({
        url: '../index/index'
    });
}

function toBack(pagesLength) {
    // #ifdef H5
    if (pagesLength > 1) {
        uni.navigateBack(1)
        return;
    } else {
        toHome()
        return;
    }
    // #endif
    if (getCurrentPages().length > 1) {
        uni.navigateBack(1)
    } else {
        toHome()
    }
}

function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

// 内容检查(旧版-云调用)
function imageCheck(tempImagePath, callback) {
    // 判断是否需要内容检查
    if (!Config.imageCheckFlag) {
        callback(tempImagePath);
        return;
    }

    let that = this
    that.$loading('安全检查中...')
    uni.compressImage({
        src: tempImagePath,
        quality: 1,
        success: res => {
            let tempFilePathCompressed = res.tempFilePath;

            // 生成随机文件名
            let ext = tempImagePath.substring(tempImagePath.lastIndexOf(".") + 1)
            let randFileName = randomString() + '.'+ext

            // 将图片上传至云存储空间
            wx.cloud.uploadFile({
                // 指定上传到的云路径
                cloudPath: randFileName,
                // 指定要上传的文件的小程序临时文件路径
                filePath: tempFilePathCompressed,
                // 成功回调
                success: res => {
                    console.log('上传云存储成功：', res.fileID)

                    //这里是 云函数调用方法
                    wx.cloud.callFunction({
                        name: 'check',
                        data: {
                            value: res.fileID
                        },
                        success(json) {
                            console.log("开始安全检查")
                            if (json.result.errCode === 87014) {
                                uni.showModal({
                                    title: '请勿使用违法违规内容',
                                    content: '图片含有违法违规内容',
                                    showCancel: false,
                                    confirmText: '朕知道了',
                                });
                            } else {
                                console.log('图片检测正常')
                                //图片合规则进行进一步处理
                                callback(tempImagePath);
                            }
                        },
                        fail(e) {
                            console.log(e);
                            uni.showModal({
                                title: '请重试',
                                content: '对不起，服务器开了小差',
                                showCancel: false,
                                confirmText: '好的',
                            });
                        },
                        complete() {
                            // 删除刚刚上传的文件
                            wx.cloud.deleteFile({
                                fileList: [res.fileID],
                                success: res => {
                                    console.log('云存储内图片已删除')
                                },
                                fail: console.error
                            })

                            that.$loading(false)
                        }
                    })
                },
            })
        }
    })
}

// 新版 https调用
function imageCheckBak(tempImagePath, callback) {
    // 判断是否需要内容检查
    if (!Config.imageCheckFlag) {
        callback(tempImagePath);
        return;
    }

    let that = this
    that.$loading('安全检查中...')
    uni.compressImage({
        src: tempImagePath,
        quality: 1,
        success: res => {
            let tempFilePathCompressed = res.tempFilePath

            imageSecCheck(tempFilePathCompressed).then(res => {
                if (res.statusCode === 204) {
                    //图片合规则进行进一步处理
                    console.log('图片检测正常')
                    that.$loading(false)
                    callback(tempImagePath);
                } else {
                    that.$loading(false)
                    uni.showModal({
                        title: '请勿使用违法违规内容',
                        content: '图片含有违法违规内容',
                        showCancel: false,
                        confirmText: '朕知道了',
                    });
                }
            }).catch(err => {
                console.log(err);
                that.$loading(false)
                uni.showModal({
                    title: '请重试',
                    content: '对不起，服务器开了小差',
                    showCancel: false,
                    confirmText: '好的',
                });

            })
        }
    })
}

export { loading, toast, toLogin, toBack, toHome, reLunchBack, imageCheck }