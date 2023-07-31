<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view style="position:absolute;z-index:12;" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <view class="t-login" :style="{opacity:pageOpacity}">
      <view class="t-b">{{title}}</view>
      <form class="cl">

        <view class="t-a">
          <image src="/static/icon/mobile.png" mode="widthFix"></image>
          <input type="number" clearable v-model="account" @input="checkIsCorAccount" placeholder="请输入手机号" />
        </view>

        <view class="t-a">
          <image src="/static/icon/code.png" mode="widthFix"></image>
          <input type="number" clearable v-model="verify_code" placeholder="请输入验证码" />
          <view class="t-c" @tap="registerCode">{{codeDuration ? codeDuration + 's' : '发送短信' }}</view>
        </view>

        <view class="t-d">未注册的手机号验证后将自动注册</view>

        <view>
          <CcButton @cctap="showLoading('loginLoading')" width="500rpx" color="#fff" bgcolor="linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);"
                    :loading="loginLoading" @tap="login">立即登录</CcButton>
        </view>

      </form>
      <view class="t-f">
        <checkbox value="cb" :checked="isChecked" @click="isChecked=!isChecked" color="#FFCC33" style="transform:scale(0.7)" />
        同意<text @tap="toAgreement">用户协议</text></view>
      <view class="t-e cl">
        <view class="t-g">
          <button @tap="getUserProfile">
            <image src="/static/icon/weixin.png"></image>
          </button>
        </view>
      </view>
    </view>


  </view>
</template>
<script>
  import CcButton from '@/components/cc-button/cc-button.vue'
  import { mapState, mapActions } from 'vuex'
  import * as Common from '@/utils/common.js'
  import { registerCode, loginQuick, wxmpLogin } from '@/utils/loginPlugin.js'

  export default {
    data() {
      return {
        title: '欢迎回来',
        loginLoading: false,
        account: '',
        // 是否是正确的邮箱或者手机号码
        isCorrectAccount: false,
        // 是否可以获取注册码|剩余时间
        codeDuration: 0,
        // 验证码
        verify_code: '',

        isChecked: false,

        pageOpacity: 0,
        searchInput: {
          width: 0,
          height: 0,
          top: 0,
          inputVal: ''
        },
      }
    },
    computed: {
      ...mapState(['hasBinding', 'hasLogin']),
    },
    components:{
      CcButton
    },
    onLoad() {

      this.searchInput.width = this.$menuButtonRect.right - this.$menuButtonRect.width;
      this.searchInput.height = this.$menuButtonRect.height
      this.searchInput.top = this.$menuButtonRect.top
      this.headerHeight = this.searchInput.top + this.searchInput.height + 12;

      // 在需要登录的地方执行初始化方法
      this.initLoginState()

      // 判断登录状态 并跳转到首页
      if (this.hasLogin) {
        this.$reLunchBack()
      }
    },
    onReady(e) {
      this.pageOpacity = 1
    },
    methods: {
      ...mapActions(['initLoginState']),

      checkIsCorAccount() {
        const account = this.account;
        this.isCorrectAccount = Common.regular('phone', account)
      },

      registerCode() {
        if (this.codeDuration) {
          this.$toast(`请在${this.codeDuration}秒后重试`)
          return
        }
        if (!this.isCorrectAccount) {
          this.$toast('手机号码格式不对/(ㄒoㄒ)/~~')
          return
        }

        // TODO 极验

        let data = {
          account: this.account
        }
        registerCode(data).then(res => {
          this.$toast(res.message)
          // 触发倒计时
          this.codeDuration = 60
          this.codeInterVal = setInterval(() => {
            this.codeDuration--
            if (this.codeDuration === 0) {
              if (this.codeInterVal) {
                clearInterval(this.codeInterVal)
                this.codeInterVal = null
              }
            }
          }, 1000)
        }).catch(err => {
          this.$toast(err.data.message)
        })
      },

      login() {
        let that = this
        if(!this.isChecked) {
          this.$toast('请先阅读并同意用户协议')
          this.loginLoading = false
          return
        }

        if (!this.account.trim().length || !this.isCorrectAccount) {
          this.$toast('登录账户格式错误!')
          this.loginLoading = false
          return
        }
        if (this.verify_code.trim().length !== 6) {
          this.$toast('验证码格式错误!')
          this.loginLoading = false
          return
        }

        loginQuick(this.account, this.verify_code).then(res => {
          that.$toast('欢迎回来')
          setTimeout(() => {
            that.loginLoading = false
            that.$reLunchBack()
          }, 500);
        })
      },

      getUserProfile(e) {
        if(!this.isChecked) {
          this.$toast('请先阅读并同意用户协议')
          this.loginLoading = false
          return
        }

        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        uni.getUserProfile({
          desc: '用于完善个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            this.$loading('拼命加载中...')
            if (res.userInfo) {
              let platform = 'weixin'
              wxmpLogin(res.userInfo, platform).then(res => {
                this.$loading(false)
                this.$reLunchBack()
              }).catch(err => {
                setTimeout(() => {this.$toast('微信登录失败'), 500})
              })
            } else {
              this.$toast('获取用户信息失败')
            }
          },
        })
      },

      showLoading(type, ttl = 3500) {
        this[type] = true
        setTimeout(() => {
          this[type] = false
        }, ttl);
      },
      toAgreement() {
        uni.navigateTo({
          url: '/pages/about/agreement'
        });
      },
    }
  }
</script>
<style>
  .container {
    transition: all 0.5s linear;
    font-size: 14px;
    line-height: 24px;
    position: relative;
  }
  .t-login {
    width: 600rpx;
    margin: 0 auto;
    font-size: 28rpx;
    color: #000
  }

  .t-login input {
    padding: 0 20rpx 0 120rpx;
    height: 90rpx;
    line-height: 90rpx;
    margin-bottom: 50rpx;
    background: #f4f4f4;
    font-size: 28rpx;
    border-radius: 50rpx
  }

  .t-login .t-a {
    position: relative
  }

  .t-login .t-a image {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    left: 40rpx;
    top: 28rpx;
    border-right: 2rpx solid #dedede;
    padding-right: 20rpx
  }

  .t-login .t-b {
    text-align: center;
    font-size: 46rpx;
    color: #000;
    padding: 150rpx 0
  }

  .t-login .t-c {
    position: absolute;
    right: 22rpx;
    top: 22rpx;
    background: linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);
    color: #fff;
    font-size: 10px;
    border-radius: 50rpx;
    height: 50rpx;
    line-height: 50rpx;
    padding: 0 25rpx;
    z-index: 2;
  }

  .t-login .t-d {
    text-align: center;
    color: #999;
    margin: 80rpx 0
  }

  .t-login .t-e {
    text-align: center;
    width: 250rpx;
    margin: 80rpx auto 0
  }

  .t-login .t-g {
    /*float: left;*/
    /*width: 100%*/
    display: flex;
  }

  .t-g button {
    border: none;
    background:none;
  }
  .t-g button::after{
    border: none;
  }

  .t-login .t-e image {
    width: 90rpx;
    height: 90rpx
  }

  .t-login .t-f {
    text-align: center;
    color: #666;
    display: flex; align-items: center;
    margin:80rpx auto 0 auto;
    justify-content: center;
  }

  .t-login .t-f text {
    margin-left: 8rpx;
    color: #999
  }

  .t-login .uni-input-placeholder {
    color: #000
  }

  .cl {
    zoom: 1
  }

  .cl:after {
    clear: both;
    display: block;
    visibility: hidden;
    height: 0;
    content: '\20'
  }
</style>
