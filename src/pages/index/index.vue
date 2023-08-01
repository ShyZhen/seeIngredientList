<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <!--  关注  -->
    <!-- #ifdef MP-WEIXIN -->
    <aTip ref="tipNotice" isCustom="true" bgColor="#31313194" borderR="5"></aTip>
    <!-- #endif -->

    <!--  header  -->
    <view class="header-container">
    </view>

    <!--  扫码进入的关注公众号  -->
    <view>
      <official-account></official-account>
    </view>

    <!--  内容  -->
    <view style="margin-top:100px">
      <view>
        <button @tap="picToTxt">请选择图片</button>
      </view>
      <view v-for="(item, index) in wordsArr" key="index" >
        <view>{{item.words}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import aTip from "@/components/a_tip/aTip";
import { getShareObj } from "@/utils/share.js";
import Config from "../../config/config";

export default {
  data() {
    return {
      baiduTokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',
      baiduOcrUrl: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic',
      pageOpacity: 0,
      wordsArr: [],
    };
  },
  components: {
    aTip,
  },
  onLoad(e) {

  },
  onReady(e) {
    this.pageOpacity = 1
  },
  onShareAppMessage(res) {
    return getShareObj()
  },
  onShareTimeline(res) {
    return getShareObj()
  },
  methods: {
    picToTxt() {
      const that = this
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {

          //获取图片的临时路径
          const tempFilePath = res.tempFilePaths[0]

          //根据官方的要求  用base64字符编码获取图片的内容
          uni.getFileSystemManager().readFile({
            filePath: tempFilePath,
            encoding: 'base64',
            success: function (res) {
              //调用方法
              that.getImgInfo(res.data)
            },
          })
        },
      })
    },

    //根据图片的内容调用API获取图片文字
    getImgInfo: function (imageData) {
      this.$loading('识别中...');

      let that = this
      that.getBaiduToken().then(res => {
        //获取token
        const token = res.data.access_token
        console.log('token', token)

        const detectUrl = that.baiduOcrUrl+'?access_token='+token
        uni.request({
          url: detectUrl,
          data: {
            image: imageData
          },
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res, resolve) {

            //将 res.data.words_result数组中的内容加入到words中
            that.wordsArr = res.data.words_result

            console.log('识别后：' + res.data.words_result)
            that.$loading(false)
          },
          fail: function (res, reject) {
            console.log('getImgInfo()：', res.data);
            that.$loading(false)
          },
          complete: function () {
            that.$loading(false)
          }
        })
      })
    },
    // 获取百度access_token
    getBaiduToken: function () {
      let that = this
      return new Promise(resolve => {
        let apiKey = Config.apiKey
        let secretKey = Config.secretKey
        let tokenUrl = that.baiduTokenUrl+`?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`

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
            console.log("BaiduToken获取失败", res);
            return resolve(res)
          }
        })
      })
    }

  }
};
</script>

<style lang="scss">
page {
  background-color: #f8f8f8;
}
.container {
  transition: all 0.5s linear;
  font-size: 14px;
  line-height: 24px;
  position: relative;
}
</style>
