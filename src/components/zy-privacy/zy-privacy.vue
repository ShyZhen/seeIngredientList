<template>
  <view>
    <view :class=" show ? 'container-show' : 'container' " :style=" 'z-index:' + zIndex ">
      <view class="mask">
        <view>
          <view class="A-title">{{ title }}</view>
          <view class="A-content">
            <text>感谢您使用本程序，在使用前您应当阅读井同意</text>
            <text class="text-color-primary" @click="handleOpenPrivacyContract">《用户隐私保护指引》</text>
            当点击同意并继续时，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力；如您拒绝，将无法继续使用小程序相关功能。
          </view>
          <view class="A-btn">
            <button class="leftBtn" id="agree-btn2" type="primary" @click="cancelClick">取消</button>

            <button class="rightBtn" id="agree-btn" type="primary" open-type="agreePrivacyAuthorization"
                    @agreeprivacyauthorization="handleAgreePrivacyAuthorization">
              同意并继续
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'privacy',

  props: {
    // show: {
    //   type: Boolean,
    //   default: false,
    // },
    zIndex: {
      type: Number,
      default: 99999,
    },
    title: {
      type: String,
      default: '用户隐私保护提示',
    }
  },

  data() {
    return {
      show: false,
    };
  },
  mounted() {
    wx.getPrivacySetting({
      success: res => {
        console.log(res)

        if (res.needAuthorization) {
          console.log('需要弹窗')
          // this.$emit('update:show', true);
          this.show = true
        } else {
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
          // wx.getUserProfile()
          // wx.chooseMedia()
          // wx.getClipboardData()
          // wx.startRecord()
        }
      },
      fail: (error) => {
        console.log(error)
      }
    })
  },

  onLoad() {},
  methods: {
    closePopup() {
      // this.$emit('update:show', false);
      this.show = false
    },
    cancelClick() {
      console.log('点击取消')
      this.closePopup();
      this.$emit('cancel');
    },
    handleAgreePrivacyAuthorization() {
      console.log('点击同意')
      this.closePopup();
      this.$emit('agree');
    },
    handleOpenPrivacyContract() {
      wx.openPrivacyContract({
        success: (e) => {}, // 打开成功
        fail: (error) => {
          this.$toast(error)
        }
      })
    }
  },
};
</script>

<style scoped>
.container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 0;
  min-height: 200rpx;
  transition: all 0s linear;
  border-radius: 25rpx;
  overflow: hidden;
}
.mask {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: gray;
  border-radius: 25rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
}
.container-show {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background:rgba(0,0,0,.5);
}
.A-title {
  min-width: 540rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 40rpx;
  color: #272848;
  font-size: 38rpx;
  font-weight: 600 !important;
}
.A-content {
  line-height: 50rpx;
  margin-top: 30rpx;
  padding-bottom: 30rpx;
  font-size: 16px;
  text-indent: 1.5em;
  text-align: justify;
}
.A-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 96rpx;
  margin-bottom: 40rpx;
  margin-top: 20rpx;
}
.leftBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 100%;
  color: #11B1D9;
  font-size: 34rpx;
  background-color: #f5f6f9;
  margin-left: 40rpx;
}
.rightBtn {
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  background-color: #11B1D9;
  margin-right: 40rpx;
}
.onlyRightBtn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  background-color: #11B1D9;
}
.text-color-primary {
  color: #11B1D9;
  /*color: #1d3549;*/
}
</style>
