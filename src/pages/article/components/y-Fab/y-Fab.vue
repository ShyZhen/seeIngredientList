<template>
	<view @touchmove.stop.prevent>
		<view class="yc-fab-box ycFly" :class="{'yc-fab-right':!left || (left && right)}" :style="{left:getLeft(),right:getRight(),bottom:bottom+'rpx'}">
			<view class="yc-fab-btn" :class="{'yc-visible':isOpen,'yc-fab-hidden':hidden}">
				<view class="yc-fab-item-box" :class="{'yc-fab-item-left':left && !right && item.imgUrl}" v-for="(item,index) in btnList"
				 :key="index" @tap.stop="handleClick(index)">

          <view v-if="item.share">
            <button open-type="share" class="button">
              <view :class="[left && !right?'yc-text-left':'yc-text-right']" v-if="item.imgUrl" :style="{fontSize:item.fontSize+'rpx',color:item.color}">{{item.text || ""}}</view>
              <view class="yc-fab-item" :style="{width:width+'rpx',height:height+'rpx',background:item.bgColor || bgColor,borderRadius:radius}">
                <view class="yc-fab-title" v-if="!item.imgUrl" :style="{fontSize:item.fontSize+'rpx',color:item.color}">{{item.text || ""}}</view>
                <image :src="item.imgUrl" class="yc-fab-img" v-else :style="{width:item.imgWidth+'rpx',height:item.imgHeight+'rpx'}"></image>
              </view>
            </button>
          </view>

          <view v-else>
            <view :class="[left && !right?'yc-text-left':'yc-text-right']" v-if="item.imgUrl" :style="{fontSize:item.fontSize+'rpx',color:item.color}">{{item.text || ""}}</view>
            <view class="yc-fab-item" :style="{width:width+'rpx',height:height+'rpx',background:item.bgColor || bgColor,borderRadius:radius}">
              <view class="yc-fab-title" v-if="!item.imgUrl" :style="{fontSize:item.fontSize+'rpx',color:item.color}">{{item.text || ""}}</view>
              <image :src="item.imgUrl" class="yc-fab-img" v-else :style="{width:item.imgWidth+'rpx',height:item.imgHeight+'rpx'}"></image>
            </view>
          </view>

				</view>
			</view>
			<view class="yc-fab-item" :class="{'yc-active':isOpen}" :style="{width:width+'rpx',height:height+'rpx',borderRadius:radius,background:bgColor,color:color}"
			 @tap.stop="handleClick(-1)">
<!--				<view class="yc-fab-icon yc-icon-plus"></view>-->
        <image src="/static/default_avatar.jpg" mode="widthFix" style="border-radius: 50%"></image>
			</view>
		</view>
		<view class="yc-fab-mask" :class="{'yc-visible':isOpen}" @tap="handleClickCancel"></view>
	</view>
</template>

<script>
	//拓展出来的按钮不应多于6个，否则违反了作为悬浮按钮的快速、高效的原则
	export default {
		name: "tuiFab",
		props: {
			//rpx 为0时值为auto
			left: {
				type: Number,
				default: 0
			},
			//rpx 当为0时且left不为0，值为auto
			right: {
				type: Number,
				default: 80
			},
			//rpx bottom值
			bottom: {
				type: Number,
				default: 100
			},
			//默认按钮 宽度 rpx
			width: {
				type: Number,
				default: 108
			},
			//默认按钮 高度 rpx
			height: {
				type: Number,
				default: 108
			},
			//圆角值
			radius: {
				type: String,
				default: "50%"
			},
			//默认按钮背景颜色
			bgColor: {
				type: String,
				default: "#f3a391"
			},
			//字体颜色
			color: {
				type: String,
				default: "#fff"
			},
			btnList: {
				type: Array,
				default () {
					return []
				}
			},
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isOpen: false,
				hidden: true,
				timer: null
			};
		},
		methods: {
			getLeft() {
				let val = "auto"
				if (this.left && !this.right) {
					val = this.left + 'rpx'
				}
				return val
			},
			getRight() {
				let val = this.right + 'rpx'
				if (this.left && !this.right) {
					val = "auto"
				}
				return val
			},
			handleClick: function(index) {
				this.hidden = false
				clearTimeout(this.timer)
				if (index == -1 && this.btnList.length) {
					this.isOpen = !this.isOpen
				} else {
					this.$emit("click", {
						index: index
					})
					this.isOpen = false
				}
				if (!this.isOpen) {
					this.timer = setTimeout(() => {
						this.hidden = true
					}, 200)
				}
			},
			handleClickCancel: function() {
				if (!this.maskClosable) return;
				this.isOpen = false
			}
		},
		beforeDestroy() {
			clearTimeout(this.timer)
			this.timer = null
		}
	}
</script>

<style lang="scss" scoped>
	.yc-fab-box {
		display: flex;
		justify-content: center;
		flex-direction: column;
		position: fixed;
		z-index: 99997;
	}

	.yc-fab-right {
		align-items: flex-end;
	}

	.yc-fab-btn {
		transform: scale(0);
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.yc-fab-hidden {
		height: 0;
		width: 0;
	}

	.yc-fab-item-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 40rpx;
	}

	.yc-fab-item-left {
		flex-flow: row-reverse;
	}

	.yc-fab-title {
		width: 90%;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.yc-text-left {
		padding-left: 28rpx;
	}

	.yc-text-right {
		padding-right: 28rpx;
	}

	.yc-fab-img {
		display: block;
	}

	.yc-fab-item {
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
		transition: all 0.2s linear;
	}

	.yc-radius {
		border-radius: 50%;
	}

	.yc-active {
		/*transform: rotate(135deg);*/
		transform: rotate(90deg);
	}

	.yc-fab-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.75);
		z-index: 99996;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.yc-visible {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
	}
  .button {
    padding: 0px;
    transition: 0.35s ease all;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    &:before {
      display: none;
    }

    &:after {
      display: none;
    }
  }
</style>
