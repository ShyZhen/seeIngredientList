<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view style="position:absolute;z-index:12;" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <!--  内容  -->
    <view :style="{'padding-top': headerHeight + 'px'}">
      wqw
    </view>

  </view>
</template>

<script>

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

    };
  },
  components: {
  },
  onLoad(e) {
    this.searchInput.width = this.$menuButtonRect.right - this.$menuButtonRect.width;
    this.searchInput.height = this.$menuButtonRect.height
    this.searchInput.top = this.$menuButtonRect.top
    this.headerHeight = this.searchInput.top + this.searchInput.height + 12;

    console.log(e)
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
</style>
