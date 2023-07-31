<template>
	<view class="container" :style="{opacity:pageOpacity}">
		<view class="like-wrap">
			<template v-if="cardList && cardList.length > 0">
				<view class="margin-bottom" v-for="(item, index) in cardList" :key="item.id">
					<y-DiaryItem :obj="item" />
				</view>
				<y-LoadMore :status="loadMoreStatus" />
			</template>
			<template v-else v-show="requestStatus">
				<y-Empty />
			</template>
		</view>
	</view>
</template>

<script>
	import { getUserTimelines, getMyCollected } from '@/apis/timelines.js'
	import { mapState, mapActions } from 'vuex'
	import yEmpty from "../article/components/y-Empty/y-Empty";
	import yLoadMore from "../article/components/y-LoadMore/y-LoadMore";
	import yDiaryItem from "../article/components/y-DiaryItem/y-DiaryItem";

	var that;
	export default {
		data() {
			return {
				actionType: 'timeline',
				pageOpacity: 0,
				cardList: [],
				startNum: 1,
				type: '',
				uuid: '',

				pageSize: 10,
				currentPage: 1,
				loadMoreStatus: 0,
				requestStatus: false,
			}
		},
		computed: {
			...mapState(['hasBinding', 'hasLogin']),
		},
		components:{
			yDiaryItem,
			yEmpty,
			yLoadMore
		},
		onLoad(e) {
			// 在需要登录的地方执行初始化方法
			this.initLoginState()

			// 判断登录状态 并跳转到首页
			if (!this.hasLogin) {
				this.$toast('需要先登录呢')
				setTimeout(() => {
					this.$toLogin()
				}, 1000);
			} else {
				this.type = e.type
				this.uuid = e.id

				if (this.type === 'collect') {
					uni.setNavigationBarTitle({
						title: '我的收藏'
					})
					this.getMyCollect(this.currentPage)

				} else {
					uni.setNavigationBarTitle({
						title: '我的日记'
					})
					this.getMyTimeline(this.currentPage)
				}
			}
		},
		onReady(e) {
			this.pageOpacity = 1
		},
		methods: {
			...mapActions(['initLoginState']),

			getMyCollect(page) {
				if (this.loadMoreStatus === 2) {
					return false
				}
				this.loadMoreStatus = 1

				let that = this
				getMyCollected(this.actionType, page).then(res => {
					that.loadMoreStatus = res.data.data.length < this.pageSize ? 2: 0
					that.cardList = that.cardList.concat(res.data.data)
					that.requestStatus = true
				})
			},
			getMyTimeline(page) {
				if (this.loadMoreStatus === 2) {
					return false
				}
				this.loadMoreStatus = 1

				let that = this
				getUserTimelines(this.uuid, page).then(res => {
					that.loadMoreStatus = res.data.data.length < this.pageSize ? 2: 0
					that.cardList = that.cardList.concat(res.data.data)
					that.requestStatus = true
				})
			},
			onReachBottom() {
				if (this.type === 'collect') {
					this.currentPage = this.currentPage + 1
					setTimeout(() => {
						this.getMyCollect(this.currentPage);
					}, 1000);
				} else {
					this.currentPage = this.currentPage + 1
					setTimeout(() => {
						this.getMyTimeline(this.currentPage);
					}, 1000);
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		transition: all 0.5s linear;
		font-size: 14px;
		line-height: 24px;
		position: relative;
	}
</style>
