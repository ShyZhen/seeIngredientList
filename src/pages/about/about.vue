<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view style="position:absolute;z-index:12;" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <view class="content">
      <!--  header  -->
      <view class="header-container">
        <view class="header">
          <view class="logo-img">
            <image src="/static/logo.jpg" mode="widthFix" lazy-load @load="onoff='1'" @tap="subscribe" />
          </view>
        </view>
        <view class="title">
          <p>配料Wiki</p>
          <p>{{ version }}</p>
        </view>
      </view>

      <view class="about">
        <view class="header"><span>敬广大用户：</span></view>
        <view class="chapter">
          <view>1. 欢迎您使用配料Wiki小程序，配料Wiki小程序旨为广大用户提供最优质、最快捷的配料查询服务。</view>
          <view>2. 未经用户允许，本项目不会收集您的任何私人信息。</view>
          <view>3. 如有数据遗漏、错误，您可通过反馈功能让我们改进。</view>
          <view>4. 建议您添加到“我的小程序”中，方便每次购物时使用或学习。</view>
          <view>5. 配料Wiki会持续为广大用户丰富配料数据库，让有害添加剂无处遁形。</view>
          <view>6. 最后感谢每位小可爱的支持，不积跬步，无以至千里，愿与君共勉，冲啊，为食品安全而战！</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getShareObj } from "@/utils/share.js";
import Config from "../../config/config";

export default {
  data() {
    return {
      pageOpacity: 0,
      version: Config.version,
      searchInput: {
        width: 0,
        height: 0,
        top: 0,
        inputVal: ''
      },
    };
  },
  onLoad(e) {
    this.searchInput.width = this.$menuButtonRect.right - this.$menuButtonRect.width;
    this.searchInput.height = this.$menuButtonRect.height
    this.searchInput.top = this.$menuButtonRect.top
  },
  onReady(e) {
    this.pageOpacity = 1
  },
  onShareAppMessage(res) {
    return getShareObj()
  },
  methods: {
    // 订阅提醒消息
    subscribe() {
      // uni.requestSubscribeMessage({
      //   tmplIds: [Config.subscribe],
      //   success (res) {
      //     console.log(res)
      //   }
      // })
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}
.container {
  transition: all 0.5s linear;
  font-size: 14px;
  line-height: 24px;
  position: relative;
  .content {
    padding: 0 32rpx;
    .header-container {
      .header {
        text-align: center;
        .logo-img {
          height: 68px;
          padding-top: 120rpx;
          image {
            width: 68px;
            height: 68px;
            border-radius: 50%;
          }
        }
      }
      .title {
        margin-top: 12px;
        text-align: center;
        font-size: 16px;
      }
    }

    .about {
      margin-top: 60rpx;
      .header{
        margin-bottom: 32rpx;
        display: inline-block;
        position: relative;
        font-size: 32rpx;
        font-weight: bold;

        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 12rpx;
          background-color: #fdefec;
        }
        span{
          position: relative;
          z-index: 2;
        }
      }
      .chapter{
        view{
          position: relative;
          margin-bottom: 20rpx;
          padding: 24rpx;
          background-color: #FFFCFC;
          border: 1px solid #E8E8E8;
          color: #666;
          font-size: 28rpx;
          line-height: 40rpx;
          border-radius: 4rpx;

          &::after{
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 76rpx;
            height: 68rpx;
            background: url(../../static/icon/remarks.png);
            background-size: 288rpx 176rpx;
          }


          &:nth-child(even){
            background-color: #FFF;
          }

          &:nth-child(1){
            &::after{
              background-position: -106rpx -10rpx;
            }
          }

          &:nth-child(2){
            &::after{
              background-position: -10rpx -98rpx;
            }
          }

          &:nth-child(3){
            &::after{
              background-position: -106rpx -98rpx;
            }
          }

          &:nth-child(4){
            &::after{
              background-position: -202rpx -10rpx;
            }
          }

          &:nth-child(5){
            &::after{
              background-position: -202rpx -98rpx;
            }
          }

          &:nth-child(6){
            &::after{
              background-position: -10rpx -10rpx;
            }
          }
        }
      }
    }
  }
}
</style>
