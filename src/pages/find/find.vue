<template>
	<view class="container" :style="{opacity:pageOpacity}">
		<view>
			<view>
				<view class="location-icon">
					<image @tap="location" src="../../static/icon/my-location.jpg" :style="{opacity:mapOpacity}" />
				</view>
			</view>
			<view class="map" :style="{opacity:mapOpacity}">
				<map id="map" ref="map" :style="'width: ' + width + 'px; height: ' + height + 'px;'" :subkey="subkey" :longitude="map.longitude"
				 :latitude="map.latitude" :scale="map.scale" :markers="markers" :include-points="markers" :polyline="polyline"
				 @markertap="handle" @callouttap="handle" @regionchange="regionChange" @updated="finish" show-location="true"
				 enable-indoorMap="true" enable-poi="true" enable-building="true" enable-3D="true">
				</map>
				<view class="search-content" :style="{top:searchInput.top+'px'}">
					<view class="search-group" :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
						<v-search
							placeholder="搜索附近吃喝玩乐..."
							@confrim="location"
							@focus="getSearchKeyWords"
							@input="getSearchKeyWords"
							@clearSearchInfo="clearSearchInfo"
						></v-search>
					</view>

					<!--关键词输入提示列表渲染-->
					<view class="search-list" v-show="showSearchList">

            <view class="search-list--item-position">
              <view class="item-position" @tap="backFillPosition">
                搜索附件 “{{searchInput.inputVal}}”
              </view>
            </view>

						<view class="search-list--item" v-for="(item, index) in suggestion" :key="index">
							<view style="text-align:center;" @tap="backFill" :id="index">{{item.title}}</view>
							<view style="font-size:12px;color:#666;text-align:center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" @tap="backFill">{{item.addr}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="hello" :style="{opacity:helloOpacity}">
				<p>今天不吃外卖</p>
				<p>我们改善生活</p>
			</view>
		</view>
	</view>
</template>

<script>
	import Config from "../../config/config";
	import {
		getShareObj
	} from "@/utils/share.js";
	import QQMapWX from '../../libs/qqmap/qqmap-wx-jssdk.min.js'

	let map
	export default {
		data() {
			return {
				showSearchList: false,
				searchInput: {
					width: 0,
					height: 0,
					top: 0,
					inputVal: ''
				},
				pageOpacity: 0,
				mapOpacity: 0,
				helloOpacity: 0,
				subkey: Config.subkey,
				height: '500px',
				width: '500px',
				markers: [],
				polyline: [],
				map: {
					scale: 16,
					latitude: 39.909,
					longitude: 116.39742,
				},
				qqMapSdk: null,
				suggestion: [],
				oldTo: null,
			};
		},
		onLoad(e) {
			// 创建地图上下文
			map = uni.createMapContext('map', this);

			// 系统屏幕宽高
			this.height = this.$systemInfoSync.windowHeight
			this.width = this.$systemInfoSync.windowWidth

			// 胶囊宽高坐标
			this.searchInput.width = (this.$systemInfoSync.windowWidth - this.$menuButtonRect.width) - 24
			this.searchInput.height = this.$menuButtonRect.height
			this.searchInput.top = this.$menuButtonRect.top
			this.location()

			this.initQQMap()
		},
		onReady(e) {
			this.pageOpacity = 1
			this.helloOpacity = 1
		},
		onShareAppMessage(res) {
			return getShareObj()
		},
		methods: {
			finish() {
				setTimeout(() => {
					this.helloOpacity = 0
					setTimeout(() => {
						this.mapOpacity = 1
					}, 2000);
				}, 1000);
			},
			/**
			 * 当前定位，获取周边关键字
			 * @param query
			 */
			location() {
				let query = this.searchInput.inputVal ? this.searchInput.inputVal : '美食'

				let that = this
				
				this.toggleSearchList(false)
				this.clearSearchList()
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						that.map.longitude = res.longitude
						that.map.latitude = res.latitude
						map.moveToLocation({
							latitude: res.latitude,
							longitude: res.longitude
						})

						this.search(query, res.latitude + ',' + res.longitude).then(res => {
							that.pushMaster(res)
						})
					},
					fail: () => {
						that.$toast('地理位置获取失败');
					}
				});
			},
			/**
			 * push master节点
			 * @param data
			 */
			pushMaster(data) {
				this.markers = [];
				for (let i = 0; i < data.data.length; i++) {
					this.markers.push({
						id: data.data[i].id.toString(),
						title: data.data[i].title,
						latitude: data.data[i].location.lat,
						longitude: data.data[i].location.lng,
						iconPath: '/static/icon/location.png',
						width: 20,
						height: 20,
						callout: {
							content: data.data[i].title,
							color: '#fff',
							fontSize: 12,
							borderRadius: 4,
							bgColor: '#464141b8',
							padding: 10,
							textAlign: 'center',
							display: 'ALWAYS'
						}
					})
				}
			},
			/**
			 * 点击气泡 、marker标记点触发：规划路线
			 * @param e
			 */
			handle(e) {
				let from = {
					latitude: this.map.latitude,
					longitude: this.map.longitude,
				}
				let to
				for (let i = 0; i < this.markers.length; i++) {
					if (e.detail.markerId === this.markers[i].id) {
						to = {
							title: this.markers[i].title,
							latitude: this.markers[i].latitude,
							longitude: this.markers[i].longitude,
						}
					}
				}
				// this.direction(from, to)
				this.directionPlugin(to)
			},
			/**
			 * 改变视角触发
			 * @param e
			 */
			regionChange(e) {},
			/**
			 * 初始化sdk
			 */
			initQQMap() {
				this.qqmapsdk = new QQMapWX({
					key: Config.subkey
				});
			},
			/**
			 * 搜索附件关键字
			 */
			search(query, location = '') {
				return new Promise((resolve, reject) => {
					this.qqmapsdk.search({
						keyword: query,
						location: location,
						page_size: 20,
						success: function(res) {
							resolve(res)
						},
						fail: function(res) {
							reject(res)
						},
					});
				})
			},
			/**
			 * 线路规划
			 * @param from
			 * @param to
			 */
			direction(from, to) {

				// 防止重复点击调用
				if (!this.oldTo) {
					this.oldTo = to
				} else {
					if (this.oldTo.latitude === to.latitude && this.oldTo.longitude === to.longitude) {
						return false
					} else {
						this.oldTo = to
					}
				}

				return new Promise((resolve, reject) => {
					let that = this;
					//调用距离计算接口
					this.qqmapsdk.direction({
						mode: 'walking', // 'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），默认：'driving'
						from: from,
						to: to,
						success: function(res) {
							let coors = res.result.routes[0].polyline,
								pl = [];
							let kr = 1000000;
							for (var i = 2; i < coors.length; i++) {
								coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
							}
							for (var i = 0; i < coors.length; i += 2) {
								pl.push({
									latitude: coors[i],
									longitude: coors[i + 1]
								})
							}

							that.map.latitude = pl[0].latitude
							that.map.longitude = pl[0].longitude
							that.polyline = [{
								points: pl,
								color: '#2B9939DD',
								width: 4
							}]
						},
						fail: function(error) {
							console.error(error);
						},
					});
				})
			},
			/**
			 * 线路规划(插件方式)
			 * @param to
			 */
			directionPlugin(to) {
				let that = this
				this.$loading('线路规划中...')
				let plugin = requirePlugin('routePlan');
				let key = this.subkey;
				let referer = Config.appName;
				let endPoint = JSON.stringify({
					'name': to.title,
					'latitude': to.latitude,
					'longitude': to.longitude
				});
				uni.navigateTo({
					url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +
						'&themeColor=#F46845',
					// 目前仅app支持动画效果
					animationType: 'fade-in',
					animationDuration: 500,
					complete: function() {
						that.$loading(false)
					}
				});
			},
			/**
			 * 数据回填方法
			 * @param e
			 */
			backFill(e) {
				let id = e.currentTarget.id;
				for (let i = 0; i < this.suggestion.length; i++) {
					if (i == id) {
						this.searchInput.inputVal = this.suggestion[i].title
						this.location()
						
						this.toggleSearchList(false)
					}
				}
			},
      /**
       * 表头 数据回填方法
       */
      backFillPosition() {
        this.location()
        this.toggleSearchList(false)
      },
			
			/**
			 * 切换搜索列表显示状态
			 * @param {Boolean} open 打开/关闭 
			 * @return void
			**/
			toggleSearchList(open = true) {
				this.showSearchList = open;
			},
			
			// 清空搜索列表
			clearSearchList() {
				this.suggestion = []
			},
			// 清空搜索信息
			clearSearchInfo() {
				this.toggleSearchList(false);
				this.clearSearchList()
			},
			getSearchKeyWords(query) {
        this.searchInput.inputVal = query.trim()

				if (!this.searchInput.inputVal) {
					this.toggleSearchList(false)
					this.clearSearchList()
					return true
				}

				let that = this;
				this.qqmapsdk.getSuggestion({
					keyword: that.searchInput.inputVal,
					location: that.map.latitude + ',' + that.map.longitude,
					policy: 1,
					filter: encodeURI("category=美食,购物,娱乐休闲,酒店宾馆"),
					success: (res) => {
						let sug = [];
						for (let i = 0; i < res.data.length; i++) {
							sug.push({
								title: res.data[i].title,
								id: res.data[i].id,
								addr: res.data[i].address,
								city: res.data[i].city,
								district: res.data[i].district,
								latitude: res.data[i].location.lat,
								longitude: res.data[i].location.lng
							});
						}
						this.toggleSearchList(true)
						
						that.suggestion = sug
					},
					fail: function(error) {
						console.error(error)
					},
					complete: function(res) {}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.container {
		transition: all 0.5s linear;
		font-size: 14px;
		line-height: 24px;
		position: relative;
	}

	.location-icon {
		position: fixed;
		z-index: 1;
		bottom: 40px;
		left: 30rpx;

		image {
			width: 38px;
			height: 38px;
			border-radius: 25px;
		}
	}

	.map {
		transition: all 0.5s linear;
	}

	.hello {
		position: absolute;
		color: #F46845;
		font-size: 20px;
		transition: all 1.5s linear;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.search-content {
		position: fixed;
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;

		.search-list {
			margin-top: 12rpx;
			border-radius: 12rpx;
			background-color: #fff;
			padding: 0 24rpx;

			&--item {
				// width: 100%;
				padding: 0 24rpx;
				border-bottom: 1rpx solid rgba(34, 34, 34, .05);
				height: 100rpx;
				//line-height: 80rpx;
				font-size: 32rpx;
				color: #222;
			}

      &--item-position {
        padding: 0 24rpx;
        border-bottom: 1rpx solid rgba(34, 34, 34, .05);
        line-height: 100rpx;
        .item-position {
          font-size:15px;
          color:#666;
          text-align:center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
		}
	}
</style>
