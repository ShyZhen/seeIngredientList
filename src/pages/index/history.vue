<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <!--  内容  -->
    <view>
      ssss
    </view>

  </view>
</template>

<script>

export default {
  data() {
    return {
      pageOpacity: 0,
    };
  },
  components: {
  },
  onLoad(e) {

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
