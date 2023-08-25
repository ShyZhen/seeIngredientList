<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view class="back" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <!--  内容  -->
    <view class="content" :style="{paddingTop: searchInput.top + 52 + 'px'}">
      <!--  背景图  -->
      <view class="card">
        <image :src="cdnUrl+item.poster" mode="aspectFill" lazy-load=true class="card-img"></image>
        <view class="card-text">
          <view v-for="(desc,index) in item.desc" :key="desc" :class="['line',{'title': index ===0}]">
            {{ desc }}
          </view>
        </view>
      </view>

      <view class="operate">
        <view class="operate-album" @click="picToTxt('album')">
          从相册选择<image class="icon" src="/static/icon/arrow_right.png" />
        </view>
        <view class="operate-camera" @click="picToTxt('camera')">
          <image class="icon" src="/static/icon/camera.png" />
          {{ item.title }}
        </view>
      </view>

      <!--   剪裁插件   -->
      <gmy-img-cropper
          ref="gmyImgCropper"
          quality="1"
          cropperType="free"
          fileType="jpg"
          @getImg="getCropImg"
      ></gmy-img-cropper>

  </view>
</template>

<script>
import {getImgInfoBase64, getImgInfoMultipart} from "@/utils/baidu"
import gmyImgCropper from "@/components/gmy-img-cropper/gmy-img-cropper"
import Config from "@/config/config";
import baiduData from "@/utils/baiduData";

export default {
   components: {
    gmyImgCropper,
  },
  data() {
    return {

      pageOpacity: 0,
      headerHeight: 0,
      searchInput: {
        width: 0,
        height: 0,
        top: 0,
      },

      cdnUrl: Config.cdnUrl,
      item: {
        id: 0,
        background: '',
        poster: '',
        title: '',
        content: '',
        image: '',
        value: '',
        desc: '',
      },
    };
  },
  components: {
  },
  onLoad(e) {
    this.searchInput.width = this.$menuButtonRect.right - this.$menuButtonRect.width;
    this.searchInput.height = this.$menuButtonRect.height
    this.searchInput.top = this.$menuButtonRect.top
    // this.headerHeight = this.searchInput.top + this.searchInput.height + 12;

    if (e.id) {
      this.item = baiduData.find(el => el.id === +e.id)
    }
    if (!this.item.value) {
      this.$toBack()
    }

  },
  onReady(e) {
    this.pageOpacity = 1
  },

  methods: {
     picToTxt(val) {
      let sourceType = [];
      sourceType = [val]
      if (!this.item.value) {
        this.$toast('请先选择识别类型')
        return false
      }
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType,
        success: (res) => {
          // 获取图片的临时路径,先进行安全检查,再剪裁
          const tempFilePath = res.tempFiles[0].tempFilePath
          this.$imageCheck(tempFilePath, this.$refs.gmyImgCropper.chooseImageNew);
        },
      })
    },

    // 剪裁完成，返回截取图片的临时路径
    getCropImg: (tempFilePath)=>{
      console.log("父页面拿到了剪裁后的图片临时地址", tempFilePath);
      if (this.item.value === 'file/2.0/mt/pictrans/v1') {
        getImgInfoMultipart(tempFilePath, this.item.value).then(res => {
          console.log('回调res', res)
          this.handleOcrData(res.data)
        })
      } else {
        getImgInfoBase64(tempFilePath, this.item.value).then(res => {
          console.log('回调res', res)
          this.handleOcrData(res.data)
        })
      }
    },

    // 将 res.data.words_result数组中的内容加入到words中
    handleOcrData: function(data) {
      switch (this.item.value) {
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

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back {
  position:absolute;
  z-index:12;
  left: 0;

  /deep/ .back-icon {
    border: 1px solid #eee;
    color: #aaa;
  }
}

.content {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.card {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 4px 19px 0px rgba(0,0,0,0.14);

  &-img {
    width: 100%;
    height: 480rpx;
    object-fit: contain;
  }

  &-text {
    writing-mode: vertical-rl;
    margin: 50rpx auto;

    .line {
      font-size: 36rpx;
      color: #666;
      border-left: 1px solid #ddd;
      width: 100rpx;
      letter-spacing: 0.5em;
      line-height: 130rpx;
    }

    .title {
      width: 120rpx;
      font-size: 60rpx;
      color: #333;
      border: 0;
    }
  }
}

.operate {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100rpx;

  &-album {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    color: #ff5f68;
    .icon {
      width: 46rpx;
      height: 36rpx;
    }
  }

  &-camera {
    margin-top: 25rpx;
    width: 360rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #fff;
    background: linear-gradient(to right, #ff754a, #ff5f68);
    border-radius: 80rpx;
    .icon {
      width: 52rpx;
      height: 46rpx;
      margin-right: 25rpx;
    }
  }
}
</style>
