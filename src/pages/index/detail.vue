<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view style="position:absolute;z-index:12;" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <!--  内容  -->
    <view :style="{'padding-top': headerHeight + 'px'}">
      <!--  背景图  -->
      <view :style="{'background': item.background}">
        <image :src="cdnUrl+item.poster" mode="aspectFill" lazy-load=true class="bg-iamge"></image>
      </view>

      <!--   按钮    -->
      <view>

      </view>
    </view>

  </view>
</template>

<script>

import Config from "@/config/config";

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

      cdnUrl: Config.cdnUrl,
      item: {
        id: 0,
        background: '',
        poster: '',
        title: '',
        content: '',
        image: '',
        value: '',
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

    if (e.item) {
      this.item = JSON.parse(e.item)
      console.log(this.item)
    }
    if (!this.item.value) {
      this.$toBack()
    }

  },
  onReady(e) {
    this.pageOpacity = 1
  },

  methods: {
    
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





.bg-iamge {
  width: 100%;
  height: 100vh;;
}
</style>
