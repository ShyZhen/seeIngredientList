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

      <!--   剪裁插件   -->
      <gmy-img-cropper
          ref="gmyImgCropper"
          quality="1"
          cropperType="free"
          fileType="jpg"
          @getImg="getCropImg"
      ></gmy-img-cropper>

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
  </view>
</template>

<script>
import {getImgInfoBase64} from "@/utils/baidu";
import {getShareObj} from "@/utils/share.js";
import gmyImgCropper from "@/components/gmy-img-cropper/gmy-img-cropper"

export default {
  data() {
    return {
      value: 'rest/2.0/image-classify/v1/plant',
      range: [
        { value: 'rest/2.0/image-classify/v1/plant', text: "拍照识花" },    // 总量1万次
        { value: 'rest/2.0/image-classify/v1/animal', text: "呆萌猛兽" },    // 总量1万次
        { value: 'rest/2.0/image-classify/v1/classify/ingredient', text: "水果蔬菜" },    // 总量1000次赠送
        { value: 'rest/2.0/image-classify/v1/currency', text: "货币钱币" },    // 总量500次赠送
        { value: 'rest/2.0/image-classify/v2/advanced_general', text: "其他识别" },    // 通用物体和场景识别 总量1万次
        // { value: 'rest/2.0/image-classify/v2/logo', text: "品牌Logo" },    // 无
      ],

      pageOpacity: 0,
      imagePlant: [],
      imageIngredient: [],
      imageCurrency: [],
      imageGeneral: [],
    };
  },
  components: {
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
          // that.$imageCheck(tempFilePath, getImgInfoBase64);
          that.$imageCheck(tempFilePath, that.$refs.gmyImgCropper.chooseImageNew);
        },
      })
    },

    // 剪裁完成，返回截取图片的临时路径
    getCropImg: function(tempFilePath){
      console.log("父页面拿到了剪裁后的图片临时地址", tempFilePath);
      const that = this

      getImgInfoBase64(tempFilePath, that.value).then(res => {
        console.log('回调res', res)
        that.handleOcrData(res.data)
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
