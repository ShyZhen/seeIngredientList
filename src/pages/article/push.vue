<template>
  <view class="container" :style="{opacity:pageOpacity}">
    <view class="publish-wrap bg-white">
      <view class="input-box padding-sm">
        <textarea class="area-top" placeholder="等我解决完温饱，再来解决你..." v-model="content" @blur="saveTemp"></textarea>
      </view>
      <view class="cu-form-group img-box">
        <view class="next-title">上传图片（最多9张）</view>
        <view class="img-wrap margin-none">
          <view class="grid col-4 grid-square flex-sub padding-top-lg">
            <view class="bg-img" v-for="(item,index) in imgList" :key="index">
              <image :src="imgList[index]" mode="aspectFill" @tap="viewImage(index)" class="img-item"></image>
              <image src="@/static/icon/close.png" @tap.stop="DelImg" :data-index="index" mode="widthFix" class="close-img"></image>
            </view>
            <view class="add-img" @tap="ChooseImage" v-if="imgList.length<9">
              <text class='cuIcon-add link-color'></text>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-btn flex-center">
        <CcButton @cctap="showLoading('saveLoading', 30000)" width="500rpx" color="#fff" bgcolor="linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);"
                  :loading="saveLoading" @tap="submitSave">发布</CcButton>
      </view>
    </view>
  </view>
</template>

<script>
import { uniUploadImage, createTimeline } from '@/apis/timelines.js'
import CcButton from '@/components/cc-button/cc-button.vue'
import { mapState, mapActions } from 'vuex'

let tempImageListKey = 'GANFANZUJIAOYINIMAGE'
let tempContentKey = 'GANFANZUJIAOYINCONTENT'

export default {
  data() {
    return {
      pageOpacity: 0,
      saveLoading: false,
      imgList: [],
      content: ''
    };
  },
  components:{
    CcButton
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin', 'statusH']),
  },
  onLoad() {

    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 未提交记录
    let tempImageList = uni.getStorageSync(tempImageListKey)
    let tempContent = uni.getStorageSync(tempContentKey)
    if (tempImageList) {
      this.imgList = tempImageList
    }
    if (tempContent) {
      this.content = tempContent
    }
  },
  onReady(e) {
    this.pageOpacity = 1
  },
  methods: {
    ...mapActions(['initLoginState']),

    // 选择图片
    ChooseImage() {
      let that = this
      uni.chooseMedia({
        count: 9, //默认9
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (fileRes) => {
          if (fileRes.tempFiles.length) {
            that.$loading('压缩上传中...')

            let counter = 0
            fileRes.tempFiles.forEach(function(item) {

              uniUploadImage(item.tempFilePath).then(res => {
                // 此处无法依赖request中的错误处理
                if (res.statusCode !== 201) {
                  that.$toast(JSON.parse(res.data).message)
                  return false
                }

                // 回显
                let url = JSON.parse(res.data).data
                if (url) {
                  that.imgList = that.imgList.concat(url)
                }

                // 保存到本地，未提交下次进来回显
                that.saveTemp()

                counter++;
                if (counter === fileRes.tempFiles.length) {
                  that.$loading(false)
                }
              }).catch(err => {
                console.log(err)
                that.$toast('上传失败，请重试')
              })
            })
          }
        }
      });
    },
    //显示删除弹窗
    DelImg(e) {
      this.imgList.splice(e.currentTarget.dataset.index, 1)
      // 保存到本地，未提交下次进来回显
      this.saveTemp()
    },
    // 预览图片
    viewImage(index) {
      let that = this
      uni.previewImage({
        current: index,
        urls: that.imgList
      })
    },
    submitSave() {
      if (!this.hasLogin) {
        this.$toast('需要登录呢，放心，内容咱帮你留着')
        setTimeout(() => {
          this.saveLoading = false
          this.$toLogin()
        }, 1000);
        return false
      }

      let that = this
      if (this.content || this.imgList.length) {
        let data = {
          title: this.content,
          poster_list: this.imgList,
        }
        createTimeline(data).then(res => {
          that.clearTemp()
          setTimeout(() => {
            that.saveLoading = false
            that.$reLunchBack()
          }, 500);
        }).catch(err => {
          setTimeout(() => {
            that.saveLoading = false
          }, 500);
        })
      } else {
        this.$toast('是不是忘记写什么啦')
        setTimeout(() => {
          that.saveLoading = false
        }, 500);
      }
    },
    saveTemp() {
      uni.setStorageSync(tempImageListKey, this.imgList)
      uni.setStorageSync(tempContentKey, this.content)
    },
    clearTemp() {
      uni.removeStorageSync(tempImageListKey)
      uni.removeStorageSync(tempContentKey)
    },
    showLoading(type, ttl = 3500) {
      this[type] = true
      setTimeout(() => {
        this[type] = false
      }, ttl);
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  transition: all 0.5s linear;
  font-size: 14px;
  line-height: 24px;
  position: relative;
}
.publish-wrap {
  .input-box {
    .area-top {
      width: 100%;
      box-shadow: inset 0 -1px 0 0 #ECECEC;
      min-height: 280rpx;
    }
  }

  .img-box {
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    margin-top: 20rpx;
    margin-bottom: 160rpx;

    .next-title {
      width: 100%;
      font-size: 36rpx;
      color: var(--mainColor);
    }

    .font-red {
      color: #ff0000;
    }

    .img-wrap {
      width: 100%;
      font-size: 28rpx;
      line-height: 44rpx;
      color: #999999;
      margin: 20rpx 0;
    }

    .add-img {
      border: 4rpx dashed #999;
      font-size: 40rpx;
    }
  }

  .bottom-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20rpx 0;
  }
}

.bg-img {
  overflow: visible !important;

  .img-item {
    border-radius: 20rpx;
  }

  .close-img {
    position: absolute;
    width: 36rpx !important;
    top: -18rpx;
    right: -18rpx;
  }
}
</style>
