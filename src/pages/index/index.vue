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

      <!--   剪裁插件   -->
      <gmy-img-cropper
          ref="gmyImgCropper"
          quality="1"
          cropperType="free"
          fileType="jpg"
          @getImg="getCropImg"
      ></gmy-img-cropper>

      <view v-if="wordsArr.length">
        <view v-for="(item, index) in wordsArr" :key="index" >
          <view @tap.stop="this.$copyThat(item.words)">{{item.words}}</view>
        </view>
      </view>

      <view v-if="wordTrans.length">
        <view v-for="(item, index) in wordTrans" :key="index" >
          <view>{{item.src}}:</view><view @tap.stop="this.$copyThat(item.dst)">{{item.dst}}</view>
        </view>
      </view>

      <view v-if="wordIDCard">
        <view v-for="(item, index) in wordIDCard" :key="index" >
          <view>{{index}} : </view><view @tap.stop="this.$copyThat(item.words)">{{item.words}}</view>
        </view>
      </view>

      <view v-if="wordBank.bank_card_number">
        <view>卡号：</view><view @tap.stop="this.$copyThat(wordBank.bank_card_number)">{{wordBank.bank_card_number}}</view>
        <view>类型：</view><view>{{wordBank.bank_card_type}}</view>
        <view>开户银行：</view><view @tap.stop="this.$copyThat(wordBank.bank_name)">{{wordBank.bank_name}}</view>
        <view>开户人：</view><view>{{wordBank.holder_name}}</view>
        <view>有效期：</view><view>{{wordBank.valid_date}}</view>
      </view>

      <view v-if="wordBusiness">
        <view v-for="(item, index) in wordBusiness" :key="index" >
          <view>{{index}} : </view><view @tap.stop="this.$copyThat(item.words)">{{item.words}}</view>
        </view>
      </view>

    </view>
    <view>点击即可复制</view>
  </view>
</template>

<script>
import aTip from "@/components/a_tip/aTip"
import {getShareObj} from "@/utils/share.js"
import {getWikiDetail} from "@/apis/wiki"
import {getImgInfoBase64, getImgInfoMultipart} from "@/utils/baidu"
import gmyImgCropper from "@/components/gmy-img-cropper/gmy-img-cropper"

export default {
  data() {
    return {
      value: 'rest/2.0/ocr/v1/general_basic',
      range: [
        { value: 'rest/2.0/ocr/v1/general_basic', text: "通用文字识别" },    // 1000次/月
        { value: 'file/2.0/mt/pictrans/v1', text: "图片翻译" },    // 总量1万次
        { value: 'rest/2.0/ocr/v1/idcard', text: "身份证" },    // 1000次/月
        { value: 'rest/2.0/ocr/v1/bankcard', text: "银行卡" },    // 1000次/月
        { value: 'rest/2.0/ocr/v1/business_license', text: "营业执照" },    // 1000次/月
        // { value: 'rest/2.0/ocr/v1/accurate_basic', text: "通用文字识别(高精度)" },    // 1000次/月
        // { value: 'rest/2.0/ocr/v1/handwriting', text: "手写文字识别" },    // 500次/月
      ],

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
    gmyImgCropper,
  },
  onLoad(e) {},
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
      // console.log("value:", this.value);
    },

    picToTxt() {
      const that = this
      if (!that.value) {
        that.$toast('请先选择识别类型')
        return false
      }

      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          // 获取图片的临时路径,先进行安全检查,再剪裁
          const tempFilePath = res.tempFiles[0].tempFilePath
          that.$imageCheck(tempFilePath, that.$refs.gmyImgCropper.chooseImageNew);
        },
      })
    },

    // 剪裁完成，返回截取图片的临时路径
    getCropImg: function(tempFilePath){
      console.log("父页面拿到了剪裁后的图片临时地址", tempFilePath);
      const that = this

      if (that.value === 'file/2.0/mt/pictrans/v1') {
        getImgInfoMultipart(tempFilePath, that.value).then(res => {
          console.log('回调res', res)
          that.handleOcrData(res.data)
        })
      } else {
        getImgInfoBase64(tempFilePath, that.value).then(res => {
          console.log('回调res', res)
          that.handleOcrData(res.data)
        })
      }
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
