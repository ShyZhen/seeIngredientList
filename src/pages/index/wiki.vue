<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <!--  header  -->
    <view class="header-container">
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

      <view v-if="imagePlant[0].name">
        <view>
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

      <view v-if="imageIngredient[0].name">
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

      <view v-if="imageGeneral[0].keyword">
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
  </view>
</template>

<script>
import { getShareObj } from "@/utils/share.js";
import Config from "../../config/config";

export default {
  data() {
    return {
      value: 'rest/2.0/image-classify/v1/plant',
      range: [
        { value: 'rest/2.0/image-classify/v1/plant', text: "花草植物" },    // 总量1万次
        { value: 'rest/2.0/image-classify/v1/animal', text: "呆萌猛兽" },    // 总量1万次
        { value: 'rest/2.0/image-classify/v1/classify/ingredient', text: "水果蔬菜" },    // 总量1000次赠送
        { value: 'rest/2.0/image-classify/v1/currency', text: "货币钱币" },    // 总量500次赠送
        { value: 'rest/2.0/image-classify/v2/advanced_general', text: "其他识别" },    // 通用物体和场景识别
        // { value: 'rest/2.0/image-classify/v2/logo', text: "品牌Logo" },    // 无
      ],

      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      pageOpacity: 0,
      imagePlant: [],
      imageIngredient: [],
      imageCurrency: [],
      imageGeneral: [],
    };
  },
  components: {
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
      console.log("e:", e);
      console.log("value:", this.value);
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

        const detectUrl = Config.baiduApiBaseUrl + this.value + '?access_token='+token
        uni.request({
          url: detectUrl,
          data: {
            image: imageData,
            baike_num: 1
          },
          method: 'POST',
          dataType: 'json',
          header: that.header,
          success: function (res, resolve) {
            // 处理ocr数据，进行正则匹配截取
            console.log('成功：', res)
            that.handleOcrData(res.data)
          },
          fail: function (res, reject) {
            console.log('fail getImgInfo()：', res.data);
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
