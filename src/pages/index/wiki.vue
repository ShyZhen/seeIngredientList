<template>
  <view class="container" :style="{opacity:pageOpacity}">

  </view>
</template>

<script>
import { getShareObj } from "@/utils/share.js";
import Config from "../../config/config";

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
  onShareAppMessage(res) {
    return getShareObj()
  },
  onShareTimeline(res) {
    return getShareObj()
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
