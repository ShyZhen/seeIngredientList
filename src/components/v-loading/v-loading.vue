<template>
	<view class="">
		<view class="loading" v-if="type === 0">
			加载中...
		</view>
		<view class="loading" v-if="type === 1">
			已经到底了
		</view>
	</view>
</template>

<script>
	
	export default {
		props: {
			type: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>
.loading{
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color: rgba(68, 66, 66, 0.63);
}
</style>
