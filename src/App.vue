<script>
export default {
  onLaunch: function() {
    console.log('App Launch');

    // 强制更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("强制更新检查", res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '提示',
        content: '检查到有新版本，但下载失败，请检查网络后重试',
        showCancel: false
      })
    })
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style lang="less">
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'colorui/animation.css';
@font-face {
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

page {
  --mainColor: #435257;
  --activeColor: #F2674A;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  background-color: #ffffff;
}

view {
  /*box-sizing: border-box;*/
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mainColor {
  color: var(--mainColor);
}

.aColor {
  color: var(--activeColor);
}

.color-nine{
  color: #999999;
}

.main-btn {
  border-radius: 40upx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mainColor);
  border: 1upx solid var(--mainColor);
  padding: 10rpx 40rpx;
}

.active-btn {
  color: #FFFFFF !important;
  background-color: var(--activeColor) !important;
  border: 1upx solid var(--activeColor) !important;
}

.bottom-btn {
  display: flex;

  .btn-item {
    flex: 1;
    color: var(--mainColor);

    .img {
      width: 50rpx;
      height: 50rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
