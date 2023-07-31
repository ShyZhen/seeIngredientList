<template>
	<view class="container" :style="{opacity:pageOpacity}">
		<view class="fans-wrap">
				<view v-if="usersList && usersList.length > 0">
					<view class="fans-item" v-for="(item, index) in usersList" :key="item.id">
						<view class="left-wrap">
							<view class="img-wrap flex-center margin-right" @tap="toOthers(item.uuid)">
								<image :src="item.avatar ? item.avatar : defaultAvatar" mode="widthFix" class="avatar"></image>
							</view>
							<text>{{item.name}}</text>
							<!--					<text class="remark">{{item.bio}}</text>-->
						</view>
						<view :class="['right-btn main-btn',item.inMyFollows ? 'active-btn' : '']" @tap="handleFans(item)">{{item.inMyFollows ? '已关注' : '+ 关注'}}</view>
					</view>
					<y-LoadMore :status="loadMoreStatus" />
				</view>
			<view v-else v-show="requestStatus">
				<y-Empty emptyText="他很高傲"/>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { followList, fanList, followUser } from '@/apis/users.js'
	import yEmpty from '../article/components/y-Empty/y-Empty'
	import yLoadMore from "../article/components/y-LoadMore/y-LoadMore";

	export default {
		data() {
			return {
				defaultAvatar: '/static/default_avatar.jpg',
				pageOpacity: 0,
				usersList: [],
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
			yEmpty,
			yLoadMore
		},
		onLoad(options) {
			// 在需要登录的地方执行初始化方法
			this.initLoginState()

			// 判断登录状态 并跳转到首页
			if (!this.hasLogin) {
				this.$toast('需要先登录呢')
				setTimeout(() => {
					this.$toLogin()
				}, 1000);
			} else {
				this.type = options.type
				this.uuid = options.id

				if (this.type === 'fans') {
					uni.setNavigationBarTitle({
						title: '粉丝列表'
					})
					this.getFansList(this.currentPage)

				} else {
					uni.setNavigationBarTitle({
						title: '关注列表'
					})
					this.getFollowList(this.currentPage)
				}
			}
		},
		onReady(e) {
			this.pageOpacity = 1
		},
		methods: {
			...mapActions(['initLoginState']),

			getFansList(page) {
				if (this.loadMoreStatus === 2) {
					return false
				}
				this.loadMoreStatus = 1

				let that = this
				fanList(this.uuid, page).then(res => {
					that.loadMoreStatus = res.data.length < this.pageSize ? 2: 0
					that.usersList = that.usersList.concat(res.data)
					that.requestStatus = true
				})
			},
			getFollowList(page) {
				if (this.loadMoreStatus === 2) {
					return false
				}
				this.loadMoreStatus = 1

				let that = this
				followList(this.uuid, page).then(res => {
					that.loadMoreStatus = res.data.length < this.pageSize ? 2: 0
					that.usersList = that.usersList.concat(res.data)
					that.requestStatus = true
				})
			},
			onReachBottom() {
				if (this.type === 'fans') {
					this.currentPage = this.currentPage + 1
					setTimeout(() => {
						this.getFansList(this.currentPage);
					}, 1000);
				} else {
					this.currentPage = this.currentPage + 1
					setTimeout(() => {
						this.getFollowList(this.currentPage);
					}, 1000);
				}
			},
			toOthers(uuid) {
				uni.navigateTo({
					url: '/pages/mine/other?id='+uuid
				});
			},
			handleFans(info) {
				const { uuid, inMyFollows } = info;
				let that = this
				if (uuid !== 'user-anonymous') {
					followUser(uuid).then(res => {
						info.inMyFollows = !inMyFollows;
						that.$toast(res.message)
					})
				} else {
					this.$toast('匿名用户无法被关注')
				}
			}
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
	.fans-wrap {
		.fans-item {
			padding: 45rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #ececec;

			.left-wrap {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: var(--mainColor);

				.img-wrap {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					overflow: hidden;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
						height: 100rpx;
					}
				}
			}

			.right-btn {
				width: 130rpx;
			}
		}
	}
</style>
