<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <!--  关注  -->
    <!-- #ifdef MP-WEIXIN -->
    <aTip ref="tipNotice" isCustom="true" bgColor="#31313194" borderR="5"></aTip>
    <!-- #endif -->

    <!--  扫码进入的关注公众号  -->
    <view>
      <official-account></official-account>
    </view>

    <view class="ganglist" :style="{'padding-top': headerHeight + 'px'}">
      <view class="gangitem center column" v-for="(item,index) in dataList" :key="item._id"
            :style="{'background':themeList[index%11].background}" @click="goPlay(item, index)">
        <image
            v-if="item.image"
            :src="item.image"
            mode="aspectFill"
            lazy-load=true
            class=""
            style="width:114rpx;height:114rpx;border-radius: 50%;"
        ></image>

        <text class="gangtitle">{{item.title}}</text>
        <text class="gangman">欢迎加入小屋</text>
        <text class="gangremark">{{item.content}}</text>
      </view>
    </view>

  </view>
</template>

<script>
import aTip from "@/components/a_tip/aTip"
import {getShareObj} from "@/utils/share.js"

export default {
  data() {
    return {
      pageOpacity: 0,
      headerHeight: 0,
      searchInput: {
        width: 0,
        height: 0,
        top: 0,
      },

      themeList:{
        0:{
          background:'linear-gradient(90deg, #dcf8e7 0%, #dcf8f7 100%)'
        },
        1:{
          background:'linear-gradient(90deg, #fff8dd 0%, #ffefeb 100%)'
        },
        2:{
          background:'linear-gradient(90deg, #fff8dc 0%, #ffefeb 100%)'
        },
        3:{
          background:'linear-gradient(90deg, #ffeadb 0%, #ffeaf6 100%)'
        },
        4:{
          background:'linear-gradient(90deg, #e5ebff 0%, #efe9ff 100%)'
        },
        5:{
          background:'linear-gradient(90deg, #f8e3ff 0%, #fce9ff 100%)'
        },
        6:{
          background:'linear-gradient(90deg, #e5ebfe 0%, #efe9ff 100%)'
        },
        7:{
          background:'linear-gradient(90deg, #e5eaff 0%, #efe9ff 100%)'
        },
        8:{
          background:'linear-gradient(90deg, #f9e3fd 0%, #fce8ff 100%)'
        },
        9:{
          background:'linear-gradient(90deg, #fff8dd 0%, #fff0e9 100%)'
        },
        10:{
          background:'linear-gradient(90deg, #ffeadf 0%, #ffeaf6 100%)'
        },
        11:{
          background:'linear-gradient(90deg, #def6e9 0%, #ddf8fa 100%)'
        }
      },

      dataList:[
        {_id: 1,image:'../../static/logo.jpg',title:'图文识别',count: 11,content:'内容水电费司令框架发'},
        {_id: 2,image:'',title:'拍照识花',count: 11,content:'内容水电费司令框架发'},
        {_id: 3,image:'',title:'拍照翻译',count: 11,content:'内容水电费司令框架发'},
        {_id: 4,image:'',title:'动物百科',count: 11,content:'内容水电费司令框架发'},
        {_id: 5,image:'',title:'身份证扫描',count: 11,content:'内容水电费司令框架发'},
        {_id: 6,image:'',title:'果蔬识别',count: 11,content:'内容水电费司令框架发'},
        {_id: 7,image:'',title:'银行卡扫描',count: 11,content:'内容水电费司令框架发'},
        {_id: 8,image:'',title:'货币钱币',count: 11,content:'内容水电费司令框架发'},
        {_id: 9,image:'',title:'营业执照扫描',count: 11,content:'内容水电费司令框架发'},
        {_id: 10,image:'',title:'万物识别',count: 11,content:'内容水电费司令框架发'},
      ],

    };
  },
  components: {
    aTip
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
    goPlay(item, index){
      item.background=this.themeList[index%11].background
      uni.navigateTo({
        url: '/pages/release/cabinList?item='+JSON.stringify(item)
      });
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

.ganglist{
  width: 100%;
  height: auto;
  padding: 20rpx;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  .gangitem{
    width: 334rpx;
    height: 340rpx;
    background:linear-gradient(90deg, #dcf8e7 0%, #dcf8f7 100%);
    border-radius: 24rpx;
    justify-content: flex-start;
    padding-top: 30rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    &:nth-child(2){
      margin-right: 0;
    }
    .gangtitle{
      font-size: 32rpx;
      font-weight: bold;
      color: #271d32;
      margin: 20rpx 0;
    }
    .gangman{
      font-size: 24rpx;
      color: #897a91;
      margin-bottom: 20rpx;
    }
    .gangremark{
      font-size: 24rpx;
      color: #897a91;
      padding: 0 20rpx;
      text-align: center;
      line-height: 30rpx;
    }
  }
}
/* #ifndef APP-PLUS-NVUE */
view,
text,
image,
video {
  box-sizing: border-box;
}
image{
  display: block;
}
text{
  line-height: 1;
}
.column{
  /* #ifndef APP-PLUS-NVUE */
  display:flex;
  /* #endif */
  flex-direction: column;
}
.center{
  /* #ifndef APP-PLUS-NVUE */
  display:flex;
  /* #endif */
  align-items: center;
  justify-content: center;
}

</style>
