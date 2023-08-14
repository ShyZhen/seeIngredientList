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

      <!--  下拉框  -->
      <view>
        <uni-data-select
            v-model="value"
            :localdata="range"
            @change="change"
        ></uni-data-select>
      </view>

      <view>
        <button @tap="picToTxt">请选择图片</button>
      </view>

      <view v-if="wordsArr.length">
        <view v-for="(item, index) in wordsArr" :key="index" >
          <view @tap.stop="getDetail(item)">4{{item.words}}</view>
        </view>
      </view>

      <view v-if="wordTrans.length">
        <view v-for="(item, index) in wordTrans" :key="index" >
          <view>{{item.src}}:{{item.dst}}</view>
        </view>
      </view>

      <view v-if="wordIDCard">
        <view v-for="(item, index) in wordIDCard" :key="index" >
          <view>{{index}} : {{item.words}}</view>
        </view>
      </view>

      <view v-if="wordBank.bank_card_number">
        <view>卡号：{{wordBank.bank_card_number}}</view>
        <view>类型：{{wordBank.bank_card_type}}</view>
        <view>开户银行：{{wordBank.bank_name}}</view>
        <view>开户人：{{wordBank.holder_name}}</view>
        <view>有效期：{{wordBank.valid_date}}</view>
      </view>

      <view v-if="wordBusiness">
        <view v-for="(item, index) in wordBusiness" :key="index" >
          <view>{{index}} : {{item.words}}</view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import aTip from "@/components/a_tip/aTip";
import { getShareObj } from "@/utils/share.js";
import Config from "../../config/config";
import {getWikiDetail} from "@/apis/wiki";

export default {
  data() {
    return {
      value: 'rest/2.0/ocr/v1/general_basic',
      range: [
        { value: 'rest/2.0/ocr/v1/general_basic', text: "通用文字识别" },    // 1000次/月
        { value: 'file/2.0/mt/pictrans/v1', text: "图片翻译" },    // 总量1万次
        // { value: 'rest/2.0/ocr/v1/accurate_basic', text: "通用文字识别(高精度)" },    // 1000次/月
        // { value: 'rest/2.0/ocr/v1/handwriting', text: "手写文字识别" },    // 500次/月
        { value: 'rest/2.0/ocr/v1/idcard', text: "身份证" },    // 1000次/月
        { value: 'rest/2.0/ocr/v1/bankcard', text: "银行卡" },    // 1000次/月
        { value: 'rest/2.0/ocr/v1/business_license', text: "营业执照" },    // 1000次/月
      ],

      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      pageOpacity: 0,
      wordsArr: [],
      wordIDCard: {},
      wordBank: {
        bank_card_number: '',
        bank_card_type: '',
        bank_name: '',
        holder_name: '',
        valid_date: '',
      },
      wordBusiness: {},
      wordTrans: [],
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
    // 下拉框
    change(e) {
      // console.log("e:", e);

      // 机器翻译的时候header不一样，参数也大不同
      // if (this.value === 'file/2.0/mt/pictrans/v1') {
      //   this.header = {
      //     'content-type': 'multipart/form-data'
      //   }
      // } else {
      //   this.header = {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   }
      // }
    },

    picToTxt() {
      const that = this
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {

          //获取图片的临时路径
          const tempFilePath = res.tempFilePaths[0]

          if (that.value === 'file/2.0/mt/pictrans/v1') {
            // 机器翻译的只能通过formdata方式传参
            that.getImgInfoMultipart(tempFilePath)
          } else {
            // 用base64字符编码获取图片的内容
            that.getImgInfoBase64(tempFilePath)

          }
        },
      })
    },

    //根据图片的内容调用API获取图片文字
    getImgInfoBase64: function (imageData) {
      this.$loading('识别中...');
      let that = this

      //获取token
      that.getBaiduToken().then(res => {
        const token = res.data.access_token

        // 需要用base64编码的图片文件
        uni.getFileSystemManager().readFile({
          filePath: imageData,
          encoding: 'base64',
          success: function (res) {
            const detectUrl = Config.baiduApiBaseUrl + that.value + '?access_token=' + token
            uni.request({
              url: detectUrl,
              data: {
                image: res.data,
                id_card_side: 'front',  // 身份证识别特有参数
              },
              method: 'POST',
              dataType: 'json',
              header: that.header,
              success: function (res, resolve) {
                // 处理ocr数据，进行正则匹配截取
                that.handleOcrData(res.data)
              },
              fail: function (res, reject) {
                console.log('fail getImgInfo()：', res.data);
              },
              complete: function () {
                that.$loading(false)
              }
            })
          },
        })
      })
    },

    //根据图片的内容调用API获取图片文字
    getImgInfoMultipart: function (imageData) {
      this.$loading('识别中...');
      let that = this

      // 获取token
      that.getBaiduToken().then(res => {
        const token = res.data.access_token
        const detectUrl = Config.baiduApiBaseUrl + that.value + '?access_token=' + token

        uni.uploadFile({
          url: detectUrl,
          filePath: imageData,
          name: 'image',
          formData: {
            from: 'auto',
            to: 'zh',
            v: 3,
            paste: 0,
          },
          //header: that.header,
          success: function (res, resolve) {
            // 处理ocr数据，进行正则匹配截取
            that.handleOcrData(res.data)
          },
          fail: function (res, reject) {
            console.log('fail getImgInfoMultipart()：', res.data);
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
        let tokenUrl = Config.baiduTokenUrl+`?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`

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
            console.log("BaiduToken()获取失败", res);
            return resolve(res)
          }
        })
      })
    },

    // 将 res.data.words_result数组中的内容加入到words中
    handleOcrData: function(data) {
      switch (this.value) {
        case 'rest/2.0/ocr/v1/general_basic':  // 通用
          this.wordsArr = data.words_result
          break
        case 'file/2.0/mt/pictrans/v1':  // 翻译
          this.wordTrans = JSON.parse(data).data.content
          break
        case 'rest/2.0/ocr/v1/idcard':  // 身份证
          this.wordIDCard = data.words_result
          break
        case 'rest/2.0/ocr/v1/bankcard':  // 银行卡
            this.wordBank = data.result
          break
        case 'rest/2.0/ocr/v1/business_license':  // 营业执照
          this.wordBusiness = data.words_result
          break
      }
    },

    // 获取分析后的详情，没有就直接百度
    getDetail: function(item) {
      let that = this
      let data = {
        title: item.words,
      }
      getWikiDetail(data).then(res => {
        console.log(res)
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
