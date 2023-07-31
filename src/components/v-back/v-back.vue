<template>
	<view class="back">
    <i class="back-icon iconfont iconjiantou" @tap="back"></i>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		methods: {
			back() {
				this.$toBack()
			},
		}
	}
</script>

<style lang="scss">
.back {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: #222;
    &-icon{
      font-size: 20px;
	  background: rgba(255, 255, 255, .4);
	  padding-left: 0;
	  margin-left: 24rpx;
	  padding: 0 24rpx;
	  border-radius: 24rpx;
    }
}
</style>
