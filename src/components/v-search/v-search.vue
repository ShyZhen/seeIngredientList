<template>
	<view class="search">
    <view class="search-input">
      <image class="search-icon" src="../../static/icon/search.png" mode="widthFix" lazy-load @load="onoff='1'"></image>
      <input
				type="text" 
				confirm-type="search" 
				v-model="query" 
				:placeholder="placeholder" 
				:maxlength="maxLength" 
				:focus="needFocus"
				@input="input"
				@confirm="confrim"
				@focus="focus"
				@blur="blur"
			>
			<view 
				v-show="showClearBtn"
				ref="searchInp"
				class="iconfont iconioscloseempty close" 
				@click="clearSearchInfo"
			></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
      needFocus: {
        type: Boolean,
        default: false
      },
			// 最多输入长度
			maxLength: {
				type: Number,
				default: 32
			},
			// 输入框提示
			placeholder: {
				type: String,
				default: '搜索商品关键字...'
			},
			// 搜索内容
			searchText: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				showClearBtn: false,
				query: ''
			};
		},
		created() {
			this.query = this.searchText
		},
		methods: {
			input() {
				this.showClearBtn = this.query !== '';
				
				this.$emit('input', this.query)
			},
			confrim() {
				const query = this.query.trim()
				if(query === '') return;
				this.$emit('confrim', query)
				this.toggleShowClearBtn(false)
			},
			focus() {
				if(this.query !== '') {
					this.toggleShowClearBtn(true)
				}
				this.$emit('focus', this.query)
			},
			blur() {
				this.toggleShowClearBtn(false)
			},
			// 是否展示清空按钮
			toggleShowClearBtn(showClearBtn) {
				this.showClearBtn = showClearBtn;
			},
			clearSearchInfo() {
				this.query = ''
				this.needFocus = false;
				
				this.$nextTick(() => {
					this.needFocus = true;
					this.toggleShowClearBtn(false)
					this.$emit('clearSearchInfo')
				})
			}
		}
	}
</script>

<style lang="scss">
$primary-padding: 24rpx;
$innerInputHeight: 60rpx;
.search{
	width: 100%;
	height: 100%;
	display: flex;
  flex-direction: row;
	align-items: center;
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.9);
	color: rgba(68, 66, 66, 0.63);
    &-icon{
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      padding-left: 24rpx;
    }
  .search-input {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    flex-shrink: 1;

    input {
      width: 100%;
      padding-left: 18rpx;
    }
  }

	.close{
		font-size: 20px;
		width: $innerInputHeight;
	}
}
</style>
