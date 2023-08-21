<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view style="position:absolute;z-index:12;" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <!--  内容  -->
    <view style="padding-top:100px">

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

      <!--   图识别    -->
      <view v-if="imagePlant.length">
        <view @tap.stop="this.$copyThat(imagePlant[0].name)">
          {{imagePlant[0].name}}
        </view>
        <view v-if="imagePlant[0].baike_info">
          <view>
            {{imagePlant[0].baike_info.description}}
          </view>
          <view>
            <img :src="imagePlant[0].baike_info.image_url" alt=""/>
          </view>
        </view>
      </view>

      <view v-if="imageIngredient.length">
        <view>
          {{imageIngredient[0].name}}
        </view>
      </view>

      <view v-if="imageCurrency.currencyCode">
        <view v-if="imageCurrency.hasdetail">货币代码：{{imageCurrency.currencyCode}}</view>
        <view>货币名称：{{imageCurrency.currencyName}}</view>
        <view v-if="imageCurrency.hasdetail">货币面值：{{imageCurrency.currencyDenomination}}</view>
        <view v-if="imageCurrency.hasdetail">货币年份：{{imageCurrency.year}}</view>
      </view>

      <view v-if="imageGeneral.length">
        <view>
          {{imageGeneral[0].keyword}}
        </view>
        <view v-if="imageGeneral[0].baike_info.description">
          <view>
            {{imageGeneral[0].baike_info.description}}
          </view>
          <view>
            <img :src="imageGeneral[0].baike_info.image_url" alt=""/>
          </view>
        </view>
      </view>


    </view>
    <view>点击即可复制</view>
  </view>
</template>

<script>
import {getShareObj} from "@/utils/share.js"
import {getImgInfoBase64, getImgInfoMultipart} from "@/utils/baidu"
import gmyImgCropper from "@/components/gmy-img-cropper/gmy-img-cropper"

export default {
  data() {
    return {
      value: 'rest/2.0/ocr/v1/general_basic',
      range: [
        { value: 'rest/2.0/ocr/v1/general_basic', text: "图文识别" },    // 1000次/月
        { value: 'file/2.0/mt/pictrans/v1', text: "拍照翻译" },    // 总量1万次
        { value: 'rest/2.0/ocr/v1/idcard', text: "身份证扫描" },    // 1000次/月
        { value: 'rest/2.0/ocr/v1/bankcard', text: "银行卡扫描" },    // 1000次/月
        { value: 'rest/2.0/ocr/v1/business_license', text: "营业执照扫描" },    // 1000次/月
        // { value: 'rest/2.0/ocr/v1/accurate_basic', text: "通用文字识别(高精度)" },    // 1000次/月
        // { value: 'rest/2.0/ocr/v1/handwriting', text: "手写文字识别" },    // 500次/月

        { value: 'rest/2.0/image-classify/v1/plant', text: "拍照识花" },    // 总量1万次
        { value: 'rest/2.0/image-classify/v1/animal', text: "动物百科" },    // 总量1万次
        { value: 'rest/2.0/image-classify/v1/classify/ingredient', text: "果蔬识别" },    // 总量1000次赠送
        { value: 'rest/2.0/image-classify/v1/currency', text: "货币钱币" },    // 总量500次赠送
        { value: 'rest/2.0/image-classify/v2/advanced_general', text: "万物识别" },    // 通用物体和场景识别 总量1万次
        // { value: 'rest/2.0/image-classify/v2/logo', text: "品牌Logo" },    // 无
      ],

      pageOpacity: 0,
      headerHeight: 0,
      searchInput: {
        width: 0,
        height: 0,
        top: 0,
      },

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

      imagePlant: [],
      imageIngredient: [],
      imageCurrency: [],
      imageGeneral: [],
    };
  },
  components: {
    gmyImgCropper,
  },
  onLoad(e) {
    this.searchInput.width = this.$menuButtonRect.right - this.$menuButtonRect.width;
    this.searchInput.height = this.$menuButtonRect.height
    this.searchInput.top = this.$menuButtonRect.top
    this.headerHeight = this.searchInput.top + this.searchInput.height + 12;
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


        case 'rest/2.0/image-classify/v1/plant':  // 花草植物
          this.imagePlant = data.result
          break
        case 'rest/2.0/image-classify/v1/animal':  // 动物
          this.imagePlant = data.result
          break
        case 'rest/2.0/image-classify/v1/classify/ingredient':  // 水果蔬菜
          this.imageIngredient = data.result
          break
        case 'rest/2.0/image-classify/v1/currency':  // 货币钱币
          this.imageCurrency = data.result
          break
        case 'rest/2.0/image-classify/v2/advanced_general':  // 通用
          this.imageGeneral = data.result
          break
      }
    },

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
