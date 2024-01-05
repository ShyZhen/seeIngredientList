<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view class="back" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <!--  内容  -->
    <view v-if="!showResult" class="content" :style="{paddingTop: searchInput.top + 52 + 'px'}">
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
          从相册选择
          <icon class="icon iconfont iconfenxiang"></icon>

        </view>
        <view class="operate-camera" @click="picToTxt('camera')">
          <icon class="icon iconfont iconxiangji3"></icon>
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

    <!--  展示结果页  -->
    <view v-if="showResult" class="content-detail" :style="{paddingTop: searchInput.top + 52 + 'px'}">
      <view v-if="wordsArr.length">
        <view v-for="(item, index) in wordsArr" :key="index" >
          <view class="border" :class="'tr-color-' + index % 2" @tap.stop="this.$copyThat(item.words)">{{item.words}}</view>
        </view>
      </view>

      <view v-if="wordTrans.length">
        <view v-for="(item, index) in wordTrans" :key="index" >
          <view class="border" :class="'tr-color-' + index % 2" @tap.stop="this.$copyThat(item.src)">{{item.src}}</view>
          <view class="border" :class="'tr-color-' + index % 2" @tap.stop="this.$copyThat(item.dst)">{{item.dst}}</view>
        </view>
      </view>

      <view v-if="wordIDCard && wordIDCardLogid">
        <view v-if="wordIDCardIsset > 0">
          <view v-for="(item, index, i) in wordIDCard" :key="i" >
            <view class="border" :class="'tr-color-' + i % 2" @tap.stop="this.$copyThat(item.words)">
              <view>{{index}} : </view><view>{{item.words}}</view>
            </view>
          </view>
        </view>
        <view v-else>
          <view class="padding-sm">
            解析失败，请上传正确格式身份证
          </view>
        </view>
      </view>

      <view v-if="wordBank.valid_date">
        <view v-if="wordBank.valid_date !== 'NO VALID'">
          <view class="border" :class="'tr-color-' + 0">
            <view>卡号：</view><view @tap.stop="this.$copyThat(wordBank.bank_card_number)">{{wordBank.bank_card_number}}</view>
          </view>
          <view class="border" :class="'tr-color-' + 1">
            <view>类型：</view><view>{{wordBank.bank_card_type}}</view>
          </view>
          <view class="border" :class="'tr-color-' + 0">
            <view>开户银行：</view><view @tap.stop="this.$copyThat(wordBank.bank_name)">{{wordBank.bank_name}}</view>
          </view>
          <view class="border" :class="'tr-color-' + 1">
            <view>开户人：</view><view>{{wordBank.holder_name}}</view>
          </view>
          <view class="border" :class="'tr-color-' + 0">
            <view>有效期：</view><view>{{wordBank.valid_date}}</view>
          </view>
        </view>
        <view v-else>
          <view class="padding-sm">
            解析失败，请上传正确格式银行卡
          </view>
        </view>
      </view>

      <view v-if="wordBusinessLogid">
        <view v-if="Object.keys(wordBusiness).length">
          <view v-for="(item, index, i) in wordBusiness" :key="index" >
            <view class="border" :class="'tr-color-' + i % 2" @tap.stop="this.$copyThat(item.words)">
              <view>{{index}} : </view><view>{{item.words}}</view>
            </view>
          </view>
        </view>
        <view v-else>
          <view class="padding-sm">
            解析失败，请上传正确格式营业执照
          </view>
        </view>
      </view>

      <view v-if="wordLogid">
        <view v-for="(item, index) in wordHand" :key="index" >
          <view class="border" :class="'tr-color-' + index % 2" @tap.stop="this.$copyThat(item.words)">{{item.words}}</view>
        </view>
      </view>

      <!--   图识别    -->
      <view v-if="imagePlant.length" class="text-center">
        <view class="padding-sm" @tap.stop="this.$copyThat(imagePlant[0].name)">
          {{imagePlant[0].name}}
        </view>
        <view v-if="imagePlant[0].baike_info && imagePlant[0].baike_info.image_url">
          <view class="">
            <img :src="imagePlant[0].baike_info.image_url" alt=""/>
          </view>
          <view class="padding-sm">
            {{imagePlant[0].baike_info.description}}
          </view>
        </view>
        <view v-else>
          <view class="padding-sm">
            没有示例图片
          </view>
        </view>
      </view>

      <view v-if="imageIngredient.length" class="text-center">
        <view class="padding-sm" @tap.stop="this.$copyThat(imageIngredient[0].name)">
          {{imageIngredient[0].name}}
        </view>
      </view>

      <view v-if="imageCurrencyLogid">
        <view v-if="imageCurrency.currencyName">
          <view v-if="imageCurrency.hasdetail" class="border" :class="'tr-color-' + 0">
            货币代码：{{imageCurrency.currencyCode}}
          </view>
          <view class="border" :class="'tr-color-' + 1">
            货币名称：{{imageCurrency.currencyName}}
          </view>
          <view v-if="imageCurrency.hasdetail" class="border" :class="'tr-color-' + 0">
            货币面值：{{imageCurrency.currencyDenomination}}
          </view>
          <view v-if="imageCurrency.hasdetail" class="border" :class="'tr-color-' + 1">
            货币年份：{{imageCurrency.year}}
          </view>
        </view>
        <view v-else>
          <view class="padding-sm">
            解析失败，请上传正确格式钱币
          </view>
        </view>

      </view>

      <view v-if="imageGeneral.length" class="text-center">
        <view class="padding-sm" @tap.stop="this.$copyThat(imageGeneral[0].keyword)">
          {{imageGeneral[0].keyword}}
        </view>
        <view v-if="imageGeneral[0].baike_info.description">
          <view>
            <img :src="imageGeneral[0].baike_info.image_url" alt=""/>
          </view>
          <view class="padding-sm">
            {{imageGeneral[0].baike_info.description}}
          </view>
        </view>
        <view v-else>
          <view class="padding-sm">
            暂无其他详细介绍
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import {getImgInfoBase64, getImgInfoMultipart} from "@/utils/baidu"
import gmyImgCropper from "@/components/gmy-img-cropper/gmy-img-cropper"
import Config from "@/config/config";
import baiduData from "@/utils/baiduData";

export default {
  data() {
    return {
      showResult: false,
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

      // 展示结果字段
      wordsArr: [],
      wordIDCard: {},
      wordIDCardIsset: 0,
      wordIDCardLogid: 0,
      wordBank: {
        bank_card_number: '',
        bank_card_type: '',
        bank_name: '',
        holder_name: '',
        valid_date: '',
      },
      wordBusiness: {},
      wordBusinessLogid: 0,
      wordTrans: [],
      imagePlant: [],
      imageIngredient: [],
      imageCurrency: [],
      imageCurrencyLogid: 0,
      imageGeneral: [],
      wordLogid: 0,
      wordHand: [],
    };
  },
  components: {
    gmyImgCropper,
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
    getCropImg: function (tempFilePath) {
      console.log("父页面拿到了剪裁后的图片临时地址", tempFilePath);
      console.log(this.item)
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
          this.wordIDCardIsset = data.words_result_num
          this.wordIDCardLogid = data.log_id
          break
        case 'rest/2.0/ocr/v1/bankcard':  // 银行卡
          this.wordBank = data.result
          break
        case 'rest/2.0/ocr/v1/business_license':  // 营业执照
          this.wordBusiness = data.words_result
          this.wordBusinessLogid = data.log_id
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
          this.imageCurrencyLogid = data.log_id
          break
        case 'rest/2.0/image-classify/v2/advanced_general':  // 通用
          this.imageGeneral = data.result
          break
        case 'rest/2.0/ocr/v1/handwriting':  // 手写
          this.wordHand = data.words_result
          this.wordLogid = data.log_id
          break
        case 'rest/2.0/ocr/v1/accurate_basic':  // 高精度
          this.wordsArr = data.words_result
          break
      }
      this.showResult = true
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
    font-size: 30rpx;
    color: #ff5f68;
    .icon {
      //width: 46rpx;
      //height: 36rpx;
      display: flex;
      font-size: 35rpx;
      transform: rotate(180deg);
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
      //width: 52rpx;
      //height: 46rpx;
      //margin-right: 25rpx;

      margin-right: 25rpx;
      font-size: xx-large;
    }
  }
}

.content-detail {
  height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #fff8dd 0%, #ffefeb 100%);
  overflow: auto;
  padding: 0 16px;
  box-sizing: border-box;
  font-size: x-large;
}
.border {
  padding: 20px 10px 20px 10px;
  border: gainsboro 1px solid;
}
/* 定义余数为 0 的行颜色 */
.tr-color-0 {
  background: #f0f0f0;
}
/* 定义余数为 1 的行颜色 */
.tr-color-1 {
  background: #fff;
}

</style>
