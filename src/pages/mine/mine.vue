<template>
	<view class="container" :style="{opacity:pageOpacity}">
		<view class="head comm-center">
			<view v-if="hasLogin">
				<image :src="user.avatar ? user.avatar : '/static/default_avatar.jpg'" mode="widthFix" @tap="updateAvatar"></image>

        <input class="name" :disabled="nameDisabled" v-model="user.name" confirm-type="send" maxlength="10"
               @tap="setDisabled('name')"  @blur="updateMyName"/>
        <input class="remarks" placeholder-class="remarks-placeholder" confirm-type="send"
               @tap="setDisabled('bio')"  @blur="updateMyInfo" maxlength="25"
               :disabled="bioDisabled" v-model="user.bio" placeholder="说点啥呢~"/>
			</view>
			<view v-else>
				<CcButton @cctap="showLoading('loginLoading')"  color="#fff" bgcolor="linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);"
						  :loading="loginLoading" @tap="goLogin">登录</CcButton>
			</view>
		</view>

		<view class="home-menu">
			<view class="row comm-center">
				<view>{{user.id}}</view>
				<view>ID</view>
			</view>
			<view class="row edge comm-center" @tap="myFollows">
				<view>{{user.followed_num}}</view>
				<view>关注</view>
			</view>
			<view class="row comm-center" @tap="myFans">
				<view>{{user.fans_num}}</view>
				<view>粉丝</view>
			</view>
		</view>

		<view class="list-menu">
			<view class="cell" @tap="myTimeline('timeline')">
				<view class="left-icon comm-center">
					<image src="/static/icon/my-timeline.png"></image>
				</view>
				<view class="txt">我的日记</view>
				<view class="right-icon comm-center">
					<image src="/static/icon/youjiantou.png"></image>
				</view>
			</view>
			<view class="cell" @tap="myTimeline('collect')">
				<view class="left-icon comm-center">
					<image src="/static/icon/collect.png"></image>
				</view>
				<view class="txt">我的收藏</view>
				<view class="right-icon comm-center">
					<image src="/static/icon/youjiantou.png"></image>
				</view>
			</view>
			<view class="cell" @tap="goShop">
				<view class="left-icon comm-center">
					<image src="/static/icon/shop_b.png"></image>
				</view>
				<view class="txt">优惠券查询</view>
				<view class="right-icon comm-center">
					<image src="/static/icon/youjiantou.png"></image>
				</view>
			</view>
			<view class="cell" @tap="report">
				<view class="left-icon comm-center">
					<image src="/static/icon/report.png"></image>
				</view>
				<view class="txt">向小埋反馈</view>
				<view class="right-icon comm-center">
					<image src="/static/icon/youjiantou.png"></image>
				</view>
			</view>
			<view class="cell" @tap="goAbout">
				<view class="left-icon comm-center">
					<image src="/static/icon/about_b.png"></image>
				</view>
				<view class="txt">关于干饭组</view>
				<view class="right-icon comm-center">
					<image src="/static/icon/youjiantou.png"></image>
				</view>
			</view>
		</view>

		<view v-if="hasLogin" class="logout">
			<CcButton @cctap="showLoading('logoutLoading')" width="500rpx" color="#fff" bgcolor="linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);"
					  :loading="logoutLoading" @tap="logout">退出登录</CcButton>
		</view>
		<view style="height: 0" v-show="updateAvatarDisable">
			<avatar
					:bgImage="imgBg"
					selWidth="200px" selHeight="200px"  ref='avatar' fileType='png'
					:avatarSrc="url" @upload="myUpload" @end="closeMyUpload" quality="1" inner=true
					avatarStyle="width: 200px; height: 200px; margin: 40px;">
			</avatar>
		</view>
	</view>
</template>

<script>
	import CcButton from '@/components/cc-button/cc-button.vue'
	import { mapState, mapActions } from 'vuex'
	import { getMyInfo } from '@/apis/users.js'
	import { updateMyName, updateMyInfo } from '@/apis/auth.js'
	import { uniUploadImageAvatar } from '@/apis/timelines.js'
	import { logout } from '@/utils/loginPlugin.js'
	import avatar from "../../components/yq-avatar/yq-avatar.vue";

	export default {
		data() {
			return {
        nameDisabled: true,
        bioDisabled: true,
				pageOpacity: 0,
        oldName: '',
        oldBio: '',
				user: {
					id: '',
					avatar: '',
					name: '',
					bio: '',
				},
				logoutLoading: false,
				loginLoading: false,

				// 头像剪裁
				updateAvatarDisable: false,
				imgBg: '',
				url: '',
			}
		},
		components:{
			CcButton,
			avatar
		},
		onLoad: function () {

			// 在需要登录的地方执行初始化方法
			this.initLoginState()

			// 判断登录状态 并跳转到首页
			if (!this.hasLogin) {
				//this.$toLogin()
			} else {
				this.initUserInfo()
			}
		},
		onReady(e) {
			this.pageOpacity = 1
		},
		computed: {
			...mapState(['hasBinding', 'hasLogin']),
		},
		methods: {
			...mapActions(['initLoginState']),

			initUserInfo() {
				this.$loading('拼命拉取中...')
				getMyInfo().then(res => {
					this.user = res.data
          this.oldName = res.data.name
          this.oldBio = res.data.bio
					this.$loading(false)
				}).catch(err => {
					this.$loading(false)
				})
			},
			goLogin() {
				let that = this
				setTimeout(() => {
					that.loginLoading = false
					that.$toLogin()
				}, 500);
			},
			logout() {
				this.bindLogout()
			},
			bindLogout() {
				let that = this
				logout().then(res => {
					setTimeout(() => {
						that.logoutLoading = false
						that.$toLogin()
					}, 500);
				})
			},
			showLoading(type, ttl = 3500) {
				this[type] = true
				setTimeout(() => {
					this[type] = false
				}, ttl);
			},
			goAbout() {
				uni.navigateTo({
					url: '/pages/about/about'
				});
			},
			goShop() {
				// this.$toast('为规范小程序环境，该功能暂时下线')
				// return false

				// uni.switchTab({
				uni.navigateTo({
					url: '/pages/shop/shop'
				});
			},
      setDisabled(type) {
        if (type === 'name') {
          this.nameDisabled = false
        } else if (type === 'bio') {
          this.bioDisabled = false
        }
      },
      cancelEdit(type) {
        if (type === 'name') {
          this.user.name = this.oldName
        } else if (type === 'bio') {
          this.user.bio = this.oldBio
        }
      },
			updateMyName() {
        if (this.user.name === this.oldName) {
          return false
        }
        this.$toast('被你发现了哦~')
        updateMyName({'name':this.user.name}).then(res => {
          this.user.name = this.oldName = res.data
        })
			},

      updateMyInfo() {
			  if (this.user.bio === this.oldBio) {
			    return false
        }
        this.$toast('双击即可修改哦~')
        updateMyInfo({'bio':this.user.bio}).then(res => {
          this.user.bio = this.oldBio = res.data.bio
        })
      },

			updateAvatar() {
				// 安全校验
				let avatar = this.$refs.avatar;
				avatar.fChooseImg(1, {selWidth: "200px", selHeight: "200px", expWidth: "200px", expHeight: "200px", inner:false}, {data: 'avatar'});
				this.updateAvatarDisable = true
			},
			myUpload(rsp) {
				let that = this
				this.$loading('压缩上传中...')
				uniUploadImageAvatar(rsp.path).then(res => {
					// 此处无法依赖request中的错误处理
					if (res.statusCode !== 201) {
						that.$toast(JSON.parse(res.data).message)
						return false
					}

					// 回显
					let url = JSON.parse(res.data).data
					if (url) {
						this.user.avatar = url
					}
					that.$toast('上传成功')

				}).catch(err => {
					that.$toast('上传失败，请重试')
				})
			},
			closeMyUpload() {
				this.updateAvatarDisable = false
			},

			myFans() {
				if (!this.hasLogin) {
					this.$toast('需要先登录呢')
					setTimeout(() => {
						this.$toLogin()
					}, 1000);
					return false
				}

				uni.navigateTo({
					url: '/pages/mine/fans?type=fans&id='+this.user.uuid
				});
			},

			myFollows() {
				if (!this.hasLogin) {
					this.$toast('需要先登录呢')
					setTimeout(() => {
						this.$toLogin()
					}, 1000);
					return false
				}

				uni.navigateTo({
					url: '/pages/mine/fans?type=follow&id='+this.user.uuid
				});
			},

			myTimeline(type) {
				if (!this.hasLogin) {
					this.$toast('需要先登录呢')
					setTimeout(() => {
						this.$toLogin()
					}, 1000);
					return false
				}

				uni.navigateTo({
					url: '/pages/mine/list?type='+type+'&id='+this.user.uuid
				});
			},

			report() {
				if (!this.hasLogin) {
					this.$toast('需要先登录呢')
					setTimeout(() => {
						this.$toLogin()
					}, 1000);
					return false
				} else {
				  // 安全验证
          uni.navigateTo({
            url: '/pages/mine/report'
          });
        }
			}
		}
	}
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
	.comm-center {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		text-align: center;
	}

	.head {
		padding-top: 10px;
		height: 400rpx;
		flex-direction: column;
		background: linear-gradient(#F46845, #fa856b);
		color: #fbf1ef;

		image {
			width: 120rpx;
			height: 120rpx;
			border: 5rpx solid #FFFFFF;
			border-radius: 100%;
		}

		.name {
			padding-top: 30rpx;
			font-size: 35rpx;
		}

		.remarks {
			padding-top: 10rpx;
			font-size: 24rpx;
			max-width: 300px;
			overflow: hidden;
			display: -webkit-box;
			/* !autoprefixer: ignorenext; */
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
		}
    .remarks-placeholder {
      color: #fbf1ef;
    }
	}

	.home-menu {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 0;
		height: 180rpx;
		border-radius: 5rpx;
		background-color: #FFFFFF;

		.row {
			width: 30%;
			font-size: 28rpx;
			font-weight: bold;
			flex-direction: column;

			view {
				line-height: 50rpx;
			}
		}

		.edge {
			border-left: 5rpx solid #f1f1f1;
			border-right: 5rpx solid #f1f1f1;
		}
	}

	.list-menu {
		background-color: #FFFFFF;

		.cell {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			border-top: 5rpx solid #f8f8f8;

			.left-icon {
				width: 15%;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.txt {
				width: 75%;
				font-size: 26rpx;
			}

			.right-icon {
				width: 10%;

				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
	}
	.logout {
		margin-top: 30px;
	}
</style>
