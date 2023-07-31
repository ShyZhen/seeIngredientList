<template>
	<view :class="['card-item',radius ? 'radius' : '']">
		<view class="item-head">
			<view class="left-info">
				<view class="img-wrap flex-center" @tap="toOthers(item.user_info.uuid)">
					<image :src="item.user_info.avatar ? item.user_info.avatar : defaultAvatar" mode="widthFix" class="avatar"></image>
				</view>
				<view class="head-box">
					<view class="head-name">{{ item.user_info.username }}</view>
					<view class="head-bio">{{ item.user_info.bio }}</view>
				</view>
			</view>
			<text class="color-nine">{{item.created_at.substring(0, 10)}}</text>
		</view>

		<view class="content" @tap="toDetails(item.uuid)">
			<view class="text-content">{{ item.title }}</view>
			<view class="img-wrap padding-bottom-lg" v-if="item.poster_list.length == 1">
				<view class="img-box">
					<image v-for="(url, idx) in item.poster_list" :key="idx" :src="url" mode="widthFix" class="img" @tap.stop @tap="viewImage(idx, item.poster_list)"></image>
				</view>
			</view>
			<view class="img-list padding-bottom-lg" v-if="item.poster_list.length > 1">
				<view class="img-box" v-for="(url, idx) in item.poster_list" :key="idx">
					<image :src="url" mode="widthFix" class="img" @tap.stop @tap="viewImage(idx, item.poster_list)"></image>
				</view>
			</view>
			<view class="bottom-btn padding-bottom-sm">
				<view class="btn-item flex-center">
					<image class="img" src="/static/icon/comment.png" mode="widthFix"></image>
					<text>{{ item.comment_num }}</text>
				</view>
				<view class="btn-item flex-center">
<!--					<image class="img" src="/static/icon/zan.png" mode="widthFix"></image>-->
          <like-button style="margin-right: 20rpx" @tap.stop @handleClick="handleLike(item)"></like-button>
					<text>{{ item.like_num }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { onlyLike } from '@/apis/action';

	export default {
		props: {
			obj: {
				type: Object
			},
			radius:{
				type: Boolean,
				default: false
			},
			noGoOther:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				defaultAvatar: '/static/default_avatar.jpg',
				item: this.obj,
				showPop: false,
				commentList: []
			};
		},
		computed: {
			...mapState(['hasBinding', 'hasLogin', 'statusH']),
		},
		watch: {
			obj(val) {
				this.list = val;
			}
		},
		onLoad() {
			// 在需要登录的地方执行初始化方法
			this.initLoginState()

			this.loadTabbars()
		},
		methods: {
			...mapActions(['initLoginState']),

			toDetails(id) {
				uni.navigateTo({
					url: '/pages/article/details?id=' + id
				});
			},
			toOthers() {
				if (this.hasLogin) {
					// 防止无限循环
					if (this.noGoOther) {
						return false
					}
					uni.navigateTo({
						url: '/pages/mine/other?id='+this.item.user_info.uuid
					});
				} else {
					this.$toast('需要先登录呢')
					setTimeout(() => {
						this.$toLogin()
					}, 1000);
				}
			},
			viewImage(index, arr) {
				let list = [];
				for (let i = 0; i < arr.length; i++) {
					list.push(arr[i]);
				}
				uni.previewImage({
					current: index,
					urls: list
				});
			},
			handleLike(item) {
				if (!this.hasLogin) {
					this.$toast('需要先登录呢')
					setTimeout(() => {
						this.$toLogin()
						this.followLoading = false
					}, 1000);
					return false
				}

				const { uuid } = item;
				let that = this
				if (uuid !== 'user-anonymous') {
					onlyLike(uuid, 'timeline').then(res => {
						if (res.data) {
							item.like_num += 1
						} else {
							that.$toast('您已经赞过该内容啦')
						}
					})
				} else {
					this.$toast('匿名用户无法被点赞')
				}
			},
		}
	};
</script>

<style lang="less" scoped>
	.radius{
		border-radius: 16rpx;
	}
	.card-item {
		padding: 20rpx 30rpx 0rpx;
		background-color: #ffffff;
		box-shadow: 0 20rpx 40rpx 0 rgba(0, 0, 0, 0.1);

		.item-head {
			display: flex;
			align-items: center;
			width: 100%;
			justify-content: space-between;

			.left-info {
				display: flex;
				align-items: center;

				.img-wrap {
					width: 80rpx;
					height: 80rpx;
					overflow: hidden;
					border-radius: 50%;

					.avatar {
						width: 100%;
						height: 80rpx;
					}
				}

				.head-box {
					color: #999;
					font-size: 12px;
					line-height: 14px;
					padding-left: 40rpx;
					.head-name {

						color: #666666;
						font-size: 30rpx;
					}
					.head-bio {
						max-width: 170px;
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient:vertical;
						-webkit-line-clamp:1;
						word-break:break-all;
						text-overflow:ellipsis;
						overflow:hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						margin-top: 2px;
					}
				}
			}

			.follow-btn {
				width: 140rpx;
				height: 60rpx;
				border: 1rpx solid var(--mainColor);
				color: var(--mainColor);
				border-radius: 40rpx;
			}

			.followed {
				color: #fff;
				background: var(--activeColor);
				border: 1rpx solid var(--activeColor);
			}
		}

		.content {
			.text-content {
				padding: 40rpx 0;
				justify-content: space-between;
				color: var(--mainColor);
				font-size: 30rpx;
				text-align: justify;
			}

			.img-list {
				display: flex;
				flex-flow: row wrap;

				.img-box {
					flex: 0 0 30%;
					margin: 0 1% 1%;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
					height: 200rpx;
					border-radius: 4px;
					background-color: #ececec;

					.img {
						width: 100%;
					}
				}
			}

			.img-wrap {
				.img-box {
					width: 100%;
					max-height: 400rpx;
					overflow: hidden;
					display: flex;
					align-items: center;
				}
			}
		}
	}

	.cont {
		--color: var(--activeColor);
		--count: 1;
	}
</style>
