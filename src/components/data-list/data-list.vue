<template>
	<view
		class="data-list-components safe-area-inset-bottom"
		:class="{ 'safe-area-inset-bottom': safeAreaInsetBottom }"
		:style="[dataListStyle]"
		@touchmove.stop.prevent
	>
		<scroll-view
			class="scroll-view"
			:scroll-top="scrollTop"
			:scroll-y="scrollingEnabled"
			:lower-threshold="lowerThreshold"
			:enable-back-to-top="enableBackToTop"
			@scroll="handleScroll"
			@scrolltolower="handleScrolltolower"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd"
		>
			<view class="scroll-content" :style="[scrollContentStyle]">
				<view class="pull-down-view">
					<slot name="refresh" v-if="$slots.refresh"></slot>
					<view class="refresh-view" v-else>
						<view class="loading-animation"></view>
						<text class="pull-down-text">{{ refreshText[refreshStatus] }}</text>
					</view>
				</view>
				<view class="scroll-list"><slot></slot></view>
				<view class="loading-view" v-if="loadingMask">
					<view class="loading-animation"></view>
					<text class="loading-text">加载中...</text>
				</view>
				<view class="empty-view" v-if="showEmpty">
					<slot name="empty" v-if="$slots.empty"></slot>
					<view class="empty-content" v-else>
						<image class="empty-image" :src="emptyImage || defaultEmptyImage" mode=""></image>
						<text class="empty-text">{{ emptyText }}</text>
					</view>
				</view>
				<view class="pull-up-view" v-else>
					<slot name="load" v-if="$slots.load"></slot>
					<view class="load-view" v-else>
						<view class="loading-animation" v-if="loadStatus != 'nomore'"></view>
						<text class="loading-text">{{ loadText[loadStatus] }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * data-list 数据列表
 * @description 数据列表展示，上拉加载更多数据，下拉刷新数据
 * @tips 如果父组件有设置padding，可能造成组件高度不正确的问题
 * @property {Number, String} page 默认分页
 * @property {Number, String} size 默认分页大小
 * @property {Boolean} loading 是否显示首次加载时的loading遮罩层
 * @property {Boolean} safeAreaInsetBottom 是否开启底部安全区域适配
 * @property {String} emptyImage 空数据提示图片
 * @property {String} emptyText 空数据提示文字
 * @property {Boolean} enableBackToTop iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部
 * @property {Number, String} refresherThreshold 下拉刷新阈值（单位px），触发 refresherrefresh 事件
 * @property {Number, String} lowerThreshold 距底部多远时（单位px），触发 scrolltolower 事件
 * @methods {Function} loadData 加载数据方法
 * @methods {Function} refreshData 刷新数据方法
 * @methods {Function} computedHeight 重新计算高度方法（有时候页面某些地方布局被改变了，会造成组件高度不能撑满的问题，就调用此方法）
 * @event {Function} load 加载 事件（参数一：分页请求参数，参数二：回调方法，需要将列表和数据总数回调回去计算 {list:数据列表对象,total:后端数据总数}）
 * @event {Function} refresh 刷新 事件（参数一：分页请求参数，参数二：回调方法，需要将列表和数据总数回调回去计算 {list:数据列表对象,total:后端数据总数}）
 * @event {Function} scroll 滚动 事件
 * @event {Function} scrolltolower 上拉触底 事件
 * @event {Function} refresherpulling 正在下拉 事件
 * @event {Function} refresherrestore 下拉刷新被复位 事件
 * @event {Function} refresherabort 下拉刷新被终止 事件
 * @event {Function} refresherrefresh 下拉刷新被触发 事件
 * @example <data-list class="data-list" ref="list" @load="handleLoad" @refresh="handleRefresh" @scroll="handleScroll"></data-list>
 */
import emptyImages from './emptyImage.js';
export default {
	name: 'data-list',
	props: {
		page: {
			type: [Number, String],
			default: 1
		},
		size: {
			type: [Number, String],
			default: 15
		},
		loading: {
			type: Boolean,
			default: true
		},
		safeAreaInsetBottom: {
			type: Boolean,
			default: true
		},
		emptyImage: {
			type: String
		},
		emptyText: {
			type: String,
			default: '暂无数据~'
		},
		enableBackToTop: {
			type: Boolean,
			default: false
		},
		refresherThreshold: {
			type: [Number, String],
			default: 80
		},
		lowerThreshold: {
			type: [Number, String],
			default: 40
		}
	},
	data() {
		return {
			list: [], // 数据列表
			total: -1, // 数据总数
			currentPage: 1, // 当前分页页码
			currentSize: 10, // 当前分页大小
			showEmpty: false, // 是否显示空数据
			waiting: false, // 是否等待加载中
			loadingMask: this.loading, // 是否显示加载中遮罩
			autoLoad: true, // 是否自动加载
			scrollTop: 0, // 设置竖向滚动条位置
			currentScrollTop: 0, // 当前竖向滚动条位置
			scrollingEnabled: true, // 是否启用竖向滚动
			pullingDown: false, // 是否正在下拉
			pullDownHeight: 0, // 下拉高度
			pullDownTimeStamp: 0, // 下拉时的时间戳
			loadStatus: 'loading',
			loadText: {
				loading: '加载中~',
				nomore: '没有更多啦~'
			},
			refreshStatus: 'soon',
			refreshText: {
				soon: '继续下拉即可刷新~',
				sure: '松开即可刷新~',
				refreshing: '正在刷新中~'
			},
			defaultEmptyImage: emptyImages.data,
			componentsHeight: 'auto' // 组件高度属性
		};
	},
	computed: {
		dataListStyle() {
			const { componentsHeight } = this;
			return {
				height: componentsHeight
			};
		},
		scrollContentStyle() {
			const style = {};
			const { pullDownHeight, pullingDown } = this;
			style.transform = pullingDown ? `translateY(${pullDownHeight}px)` : `translateY(0px)`;
			style.transition = pullingDown ? `transform .1s linear` : `transform 0.3s cubic-bezier(0.19,1.64,0.42,0.72)`;
			return style;
		}
	},
	mounted() {
		this.handleInit();
	},
	methods: {
		// 数据加载
		loadData() {
			this.waiting = true;
			this.$emit('load', { page: this.currentPage, size: this.currentSize }, res => {
				this.waiting = false;
				this.loadingMask = false;
				this.list = res.list;
				this.total = res.total;
				this.currentPage++;
				this.handleComputeData();
				this.computedHeight();
			});
		},
		// 刷新数据
		refreshData() {
			this.currentPage = this.page;
			this.currentSize = this.size;
			this.$emit('refresh', { page: this.currentPage, size: this.currentSize }, res => {
				this.autoLoad = true;
				this.pullingDown = false;
				this.pullDownHeight = 0;
				this.list = res.list;
				this.total = res.total;
				this.currentPage++;
				this.handleComputeData();
				this.computedHeight();
				this.$emit('refresherrestore');
			});
		},
		// 计算高度
		computedHeight() {
			this.getRect('.data-list-components').then(res => {
				// #ifdef H5
				this.componentsHeight = `calc(100vh - ${res.top}px - var(--window-top))`;
				// #endif
				// #ifndef H5
				this.componentsHeight = `calc(100vh - ${res.top}px)`;
				// #endif
				this.autoLoad = true;
				this.$nextTick(() => {
					this.handleAutoLoadData();
				});
			});
		},
		// 自动加载数据
		async handleAutoLoadData() {
			if (this.autoLoad && this.loadStatus != 'nomore') {
				const components = await this.getRect('.data-list-components');
				const scrolList = await this.getRect('.scroll-list');
				if (scrolList.height <= components.height) {
					this.loadData();
				} else {
					this.autoLoad = false;
				}
			}
		},
		// 计算数据
		handleComputeData() {
			const len = this.list.length;
			const total = this.total;
			if (len == 0 || total == 0) {
				this.autoLoad = false;
				this.showEmpty = true;
			} else if (len >= this.total) {
				this.autoLoad = false;
				this.showEmpty = false;
				this.loadStatus = 'nomore';
			} else if (len < this.total) {
				this.showEmpty = false;
				this.loadStatus = 'loading';
			}
		},
		// 上拉触底事件
		handleScrolltolower(e) {
			this.$emit('scrolltolower', e);
			if (this.loadStatus == 'nomore' || this.waiting) return;
			this.loadData();
		},
		// 滚动事件
		handleScroll(e) {
			this.currentScrollTop = e.detail.scrollTop;
			this.$emit('scroll', e);
		},
		// 触摸按下处理
		handleTouchStart(e) {
			this.pullingDown = true;
			this.currentTouchStartY = e.touches[0].clientY;
		},
		// 触摸按下滑动处理
		handleTouchMove(e) {
			this.$emit('refresherpulling', e);
			if (e.touches[0].clientY < this.currentTouchStartY) return;
			const shakeInterval = 1000 / 60;
			const currentTimeStamp = new Date().getTime();
			if (this.pullDownTimeStamp && currentTimeStamp - this.pullDownTimeStamp <= shakeInterval) return;
			this.pullDownTimeStamp = currentTimeStamp;
			const currentTouchMoveY = e.touches[0].clientY;
			const movingDistance = (currentTouchMoveY - this.currentTouchStartY) * 0.7;
			const moreDistance = movingDistance > this.refresherThreshold ? (movingDistance - this.refresherThreshold) * 0.3 : 0;
			const computeDistance =
				movingDistance > this.refresherThreshold ? this.refresherThreshold + moreDistance : movingDistance + moreDistance;
			if (computeDistance >= this.refresherThreshold) {
				this.refreshStatus = 'sure';
			} else {
				this.refreshStatus = 'soon';
			}
			this.pullDownHeight = computeDistance;
		},
		// 触摸松开处理
		handleTouchEnd(e) {
			if (this.pullDownHeight < this.refresherThreshold) {
				this.pullingDown = false;
				this.pullDownHeight = 0;
				this.refreshStatus = 'soon';
				this.$emit('refresherabort', e);
			} else {
				this.pullDownHeight = this.refresherThreshold;
				this.refreshStatus = 'refreshing';
				this.$emit('refresherrefresh', e);
				this.refreshData();
			}
		},
		// 初始化
		handleInit() {
			this.currentPage = this.page;
			this.currentSize = this.size;
			this.computedHeight();
		},
		// 查询dom节点信息
		getRect(selector, all) {
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect);
						}
						if (!all && rect) {
							resolve(rect);
						}
					})
					.exec();
			});
		}
	}
};
</script>

<style scoped lang="scss">
.data-list-components {
	height: 100%;
	.scroll-view {
		height: 100%;
		.scroll-content {
			width: 100%;
			height: 100%;
			position: relative;
			.empty-view {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.empty-content {
					margin: auto;
					display: flex;
					align-items: center;
					flex-direction: column;
					.empty-image {
						width: 400rpx;
						height: 400rpx;
					}
					.empty-text {
						color: #606266;
						margin-top: 20rpx;
					}
				}
			}
			.pull-down-view {
				top: 0;
				left: 0;
				width: 100%;
				padding: 30rpx 0;
				display: flex;
				position: absolute;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				transform: translateY(-100%);
				.refresh-view {
					display: flex;
					align-items: center;
					flex-direction: column;
					.loading-animation {
						width: 50rpx;
						height: 50rpx;
					}
					.pull-down-text {
						color: #606266;
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}
			}
			.scroll-list {
				display: flex;
				flex-direction: column;
			}
			.loading-view {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				.loading-animation {
					width: 40rpx;
					height: 40rpx;
				}
				.loading-text {
					color: #606266;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
			.pull-up-view {
				width: 100%;
				padding: 15rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
				.load-view {
					display: flex;
					align-items: center;
					.loading-animation {
						width: 30rpx;
						height: 30rpx;
					}
					.loading-text {
						color: #606266;
						font-size: 24rpx;
						margin-left: 20rpx;
					}
				}
			}
			.loading-animation {
				position: relative;
				&::after,
				&::before {
					left: 0;
					width: 100%;
					position: absolute;
					border: 0 solid currentColor;
					background-color: #b7b7b7;
				}
				&::after {
					content: '';
					top: -25%;
					z-index: 1;
					height: 100%;
					border-radius: 10%;
					animation: spin 0.6s -0.1s linear infinite;
				}
				&::before {
					content: '';
					bottom: -9%;
					height: 10%;
					background: #000;
					border-radius: 50%;
					opacity: 0.2;
					animation: shadow 0.6s -0.1s linear infinite;
				}
				@keyframes spin {
					17% {
						border-bottom-right-radius: 10%;
					}
					25% {
						transform: translateY(25%) rotate(22.5deg);
					}
					50% {
						border-bottom-right-radius: 100%;
						transform: translateY(50%) scale(1, 0.9) rotate(45deg);
					}
					75% {
						transform: translateY(25%) rotate(67.5deg);
					}
					100% {
						transform: translateY(0) rotate(90deg);
					}
				}
				@keyframes shadow {
					50% {
						transform: scale(1.25, 1);
					}
				}
			}
		}
	}
}
</style>
