<template>
  <view class="top" :style="{'display':(flag===true? 'block':'none')}">
    <i class="topc iconfont icontopt01"  size="50" @click="top"></i>
  </view>
</template>

<script>
export default {
  props: {
    // 最多输入长度
    flag: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    };
  },
  created() {
    this.query = this.searchText
  },
  methods: {
    // 回到顶部
    top() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    // 根据距离顶部距离是否显示回到顶部按钮
    onPageScroll(e) {
      if (e.scrollTop > 600) {
        this.flag = true
      } else {
        this.flag = false
      }
    }
  }
}
</script>

<style lang="scss">
.top {
  position: relative;
  display: none;
}

.topc {
  position: fixed;
  right: 20px;
  top: 75%;
  color: #cccaca94;
  font-size: 20px;
}
</style>
