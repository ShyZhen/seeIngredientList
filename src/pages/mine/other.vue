<template>
  <view class="other">
    <view class="info-box">
      <y-PersionInfo :info="info" @change="handleMenu" />
    </view>
    <view class="diary-box" v-if="cardList && cardList.length > 0">
      <view class="scroll-wrapper">
        <!-- 日记list -->
        <view class="margin-bottom" v-for="(item, index) in cardList" :key="index">
          <y-DiaryItem :obj="item" :radius="true" :noGoOther="true" />
        </view>
        <y-LoadMore :status="loadMoreStatus" />
      </view>
    </view>
    <view class="empty" v-else>
      <y-Empty />
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getUserInfo } from '@/apis/users.js'
import { getUserTimelines } from '@/apis/timelines.js'
import yDiaryItem from '../article/components/y-DiaryItem/y-DiaryItem'
import yLoadMore from '../article/components/y-LoadMore/y-LoadMore'
import yPersionInfo from '../article/components/y-PersionInfo/y-PersionInfo'
import yEmpty from '../article/components/y-Empty/y-Empty'

var that;
export default {
  data() {
    return {
      pageOpacity: 0,
      info: {},
      cardList: [],
      loadMoreStatus: 0,
      pageSize: 10,
      currentPage: 1,
      userUuid: 0,
    };
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
      this.userUuid = e.id
      this.initUserInfo(this.userUuid)
      this.getUserTimelines(this.userUuid, this.currentPage)
    }
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin']),
  },
  components:{
    yDiaryItem,
    yLoadMore,
    yPersionInfo,
    yEmpty,
  },
  methods: {
    ...mapActions(['initLoginState']),

    initUserInfo(id) {
      this.$loading('拼命拉取中...')
      getUserInfo(id).then(res => {
        this.info = res.data
        this.$loading(false)
      }).catch(err => {
        this.$loading(false)
      })
    },

    getUserTimelines(userUuid, page) {
      if (this.loadMoreStatus === 2) {
        return false
      }
      this.loadMoreStatus = 1

      let that = this
      getUserTimelines(userUuid, page).then(res => {
        that.loadMoreStatus = res.data.data.length < this.pageSize ? 2: 0
        that.cardList = that.cardList.concat(res.data.data)
      })
    },
    //上滑加载
    onReachBottom() {
      this.currentPage = this.currentPage + 1
      setTimeout(() => {
        this.getUserTimelines(this.userUuid, this.currentPage);
      }, 1000);
    },

    handleMenu(index) {
      if (!this.hasLogin) {
        this.$toast('需要先登录呢')
        setTimeout(() => {
          this.$toLogin()
        }, 1000);
        return false
      }

      switch (index) {
        case 'follow':
          uni.navigateTo({
            url: '/pages/mine/fans?type=follow&id='+this.userUuid
          });
          break;
        case 'fans':
          uni.navigateTo({
            url: '/pages/mine/fans?type=fans&id='+this.userUuid
          });
          break;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.other {
  .info-box {
    padding-bottom: 110rpx;
  }

  .diary-box {
    margin: 0 40rpx;
  }
}
</style>
