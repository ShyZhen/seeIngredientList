<template>
	<!-- #ifdef H5	 -->	
	<view 
		class="mix-refresh-content"
		:style="{
				transform: 'translateY('+ pageDeviation +'px)',
				transition: pageTransition + 's',
				height: 'calc(100% - ' + pageTop + 'px)',
				maxHeight: 'calc(100% - ' + pageTop + 'px)'
			}"
		@touchstart="pageTouchstart"
		@touchmove="pageTouchmove"
		@touchend="pageTouchend"
	>
	<!-- #endif -->
	<!-- #ifndef H5	 -->	
	<view 
		class="mix-refresh-content"
		:style="{
				transform: 'translateY('+ pageDeviation +'px)',
				transition: pageTransition + 's',
				height: 'calc(100vh - ' + pageTop + 'px)',
				maxHeight: 'calc(100vh - ' + pageTop + 'px)'
			}"
		@touchstart="pageTouchstart"
		@touchmove="pageTouchmove"
		@touchend="pageTouchend"
	>
	<!-- #endif -->
	
		<!-- 下拉刷新 -->
		<view class="mix-loading-wrapper">
			<text class="cuIcon-icloading cu-load loading"></text>
			<text>{{loadingText}}</text>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	let startY, moveY, windowHeight = 500, platform;
	let timeDiff = 0;
	let touchending;
	export default {
		
		props: {
			top: {
				//距离顶部距离，单位upx
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				pageDeviation: 0, //下偏移量
				pageTransition: 0, //回弹过渡时间
				refreshReady: false, //进入刷新准备状态
				refreshing: false, // 进入刷新状态
        loadingText: '等我解决完温饱，再来解决你',
        loadingTextArr: [
          '所有事情都变得和长胖一样简单就好了',
          '难过的时候可以摸摸自己的小肚子',
          '吃好喝好,长生不老',
          '你说的很对,不过我不听',
          '物极必反,人美必单',
          '吃过全家桶就算一家人了',
          '我不是真的胖,只是女娲捏我的时候土用多了',
          '你是人间四月天,我是东北地三鲜',
          '美丑有命,胖瘦在天',
          '从今天开始,我不再是单身狗,而是热狗',
          '走自己的路,和爱情兵分两路',
          '我只要吃得够快,脂肪就追不上我',
          '不让我早恋,等我三十可别逼婚',
        ],
			};
		},
		computed: {
			pageTop(){
				return uni.upx2px(this.top);
			}
		},
		created(){
			uni.getSystemInfo({
				success: function(e) {
					platform = e.platform;
					windowHeight = e.windowHeight;
				}
			})
		},
		methods: {
			pageTouchstart(e){
				touchending = false;
				this.pageTransition = 0;
				startY = e.touches[0].pageY;
			},
			pageTouchmove(e){
				if(touchending){
					return;
				}
				moveY = (e.touches[0].pageY - startY) * 0.4;
				if(moveY >= 0){
					this.pageDeviation = moveY;
					
					this.$emit('setEnableScroll', false);
				}
				if(moveY >= 50 && this.refreshReady === false){
					this.refreshReady = true;
				}else if(moveY < 50 && this.refreshReady === true){
					this.refreshReady = false;
				}
				if(platform === 'ios' && e.touches[0].pageY > windowHeight + 10){
					this.pageTouchend();
				}
			},
			pageTouchend(){
				touchending = true;
				if(moveY === 0){
					return;
				}
				this.pageTransition = 0.3;
				if(moveY >= 50){
					this.startPulldownRefresh();
				}else{
					this.pageDeviation = 0;
				}
				
				if(this.refreshReady === true){
					this.refreshReady = false;
				}
				//修复下拉一点回弹后页面无法滚动的bug
				this.$emit('setEnableScroll', true);
				startY = moveY = 0;
			},
			//开启下拉刷新
			startPulldownRefresh(){
				if(+new Date() - timeDiff < 100){
					return;
				}
				timeDiff = +new Date();
				this.refreshing = true;
				this.pageDeviation = uni.upx2px(90);
				this.$emit('refresh');
			},
			//结束下拉刷新
			endPulldownRefresh(){

			  // 更换loadingText
        this.loadingText = this.loadingTextArr[Math.floor(Math.random()*this.loadingTextArr.length)]

				let that = this
				setTimeout(function(){
					that.refreshing = false;
					that.pageDeviation = uni.upx2px(0);
				},1200)
				//this.$emit('setEnableScroll', true);
			},
		}
	}
</script>

<style lang="less" scoped>
	.mix-refresh-content{
		display: flex;
		flex-direction: column;
		position: relative;
	}
	/* 下拉刷新部分 */
	.mix-loading-wrapper{
		position: absolute;
		left: 0;
		top: 0;
		transform: translateY(-100%);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100rpx;
		font-size: 24rpx;
		.cu-load{
			font-size: 36rpx;
		}
	}
	
	.mix-loading-icon{
		width: 70upx;
		height: 70upx;
		transition: .3s;
	}
	.mix-loading-icon.ready{
		transform: scaleX(1.3);
	}
	.mix-loading-icon.active{
		animation: loading .5s ease-in infinite both alternate;
	}
	
	@keyframes loading {
		0% {
			transform: translateY(-20upx) scaleX(1);
		}
		100% {
			transform: translateY(4upx)  scaleX(1.3);
		}
	}
	
</style>
