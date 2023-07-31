<template>
  <view class="container" :style="{opacity:pageOpacity}">
    <view class="home">
      <view class="card-bottom">
        <!-- 顶部分页栏 -->
        <view class="top-tab">
          <view :class="['tab-item flex-center', activeTab == index ? 'active' : '']" @tap="handleTab(index)" v-for="(item, index) in tabList" :key="index">{{ item.title }}</view>
        </view>
        <y-Refresh ref="mixPulldownRefresh" :top="100" @refresh="onPulldownReresh">
          <view class="scroll-wrapper">
            <!-- 漂流瓶 -->
            <view v-if="activeTab == 0">
              <view class="margin-bottom" v-for="(item, index) in tabList[activeTab].postsList" :key="item.id">
                <y-DiaryItem :obj="item" :radius=true />
              </view>
            </view>
            <view v-else>
              <view class="margin-bottom" v-for="(item, index) in tabList[activeTab].postsList" :key="item.id">
                <y-DiaryItem :obj="item" />
              </view>
            </view>
            <y-LoadMore :status="tabList[activeTab].loadMoreStatus" />
          </view>
        </y-Refresh>
        <!-- 右下角按钮 -->
        <y-Fab :bottom="140" :right="40" :btnList="fabList" @click="handleFab" />
      </view>
    </view>
  </view>
</template>

<script>
import yRefresh from './components/y-Refresh/y-Refresh'
import yDiaryItem from './components/y-DiaryItem/y-DiaryItem'
import yLoadMore from './components/y-LoadMore/y-LoadMore'
import yFab from './components/y-Fab/y-Fab'
import { getTimelineList } from '@/apis/timelines.js'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      activeTab: 0,
      pageSize: 10,
      // tab的名称
      tabList: [
        {
          title: '最新',
          id: 'new',
        },
        {
          title: '热门',
          id: 'hot',
        }
      ],
      cardList: [],
      rightList: [],
      //fab的设置
      fabList: [
        {
          bgColor: '#F46845',
          text: '发布',
          fontSize: 28,
          color: '#fff'
        },
        {
          bgColor: '#fa7e62',
          text: '分享',
          fontSize: 28,
          color: '#fff',
          share: true
        }
      ],
      pageOpacity: 0,
    };
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin', 'statusH']),
  },
  components:{
    yRefresh,
    yDiaryItem,
    yLoadMore,
    yFab
  },
  onShareAppMessage(res) {
    return {
      title: '干饭人日记',
      path: '/pages/article/article',
      imageUrl: '',
      desc: '等我解决完温饱，再来解决你',
    }
  },

  onLoad() {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    this.loadTabbars()
  },
  onReady(e) {
    this.pageOpacity = 1
  },
  methods: {
    ...mapActions(['initLoginState']),

    // 获取分类
    loadTabbars() {
      this.tabList.forEach(item => {
        this.$set(item, 'postsList', [])
        // 加载更多 0加载前，1加载中，2没有更多了
        this.$set(item, 'loadMoreStatus', 0)
        this.$set(item, 'refreshing', 0)
        this.$set(item, 'currentPage', 1)
      })
      this.loadData('add')
    },

    loadData(type) {
      let that = this
      let tabItem = this.tabList[this.activeTab]
      // 加载
      if (type === 'add') {
        if (tabItem.loadMoreStatus === 2){
          return
        }
        tabItem.loadMoreStatus = 1
      }
      // 刷新
      if (type === 'refresh') {
        tabItem.currentPage = 1
      }

      getTimelineList(tabItem.id, tabItem.currentPage).then(res => {
        let list = res.data.data
        if (type === 'refresh') {
          // 刷新前清空数组
          tabItem.postsList = []
        }
        list.forEach(item => {
          tabItem.postsList.push(item)
        })

        // 下拉刷新 关闭刷新动画
        if (type === 'refresh') {
          that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
          tabItem.loadMoreStatus = 0
        }

        // 上滑加载 处理状态以及页数
        if (type === 'add') {
          tabItem.loadMoreStatus = list.length < this.pageSize ? 2: 0
        }
        tabItem.currentPage += 1
      }).catch(err => {})
    },
    onReachBottom() {
      //上滑加载
      setTimeout(() => {
        this.loadData('add');
      }, 1000);
    },
    //下拉刷新
    onPulldownReresh() {
      this.loadData('refresh');
    },
    handleTab(index) {
      this.activeTab = index;
      this.loadData('add')
    },
    //点击右下角tab按钮
    handleFab(e) {
      let index = e.index;
      switch (index) {
        case 0:
          if (this.hasLogin) {
            uni.navigateTo({
              url: './push'
            });
          } else {
            this.$toast('发文需要先登录呢')
            setTimeout(() => {
              this.saveLoading = false
              this.$toLogin()
            }, 1000);
            return false
          }
          break;
        case 1:
          console.log(1);
          break;
      }
    },

    findArticle() {
      // let pages = getCurrentPages();
      // let currPage = pages[pages.length - 1];
      // let currData = currPage.data.tabList[this.activeTab].postsList
      // if (currData) {
      //   this.$set(currData.find(currData => currData.id === 56), 'like_num', 199)
      // }

      // let tabList = this.tabList[this.activeTab].postsList
      // console.log(tabList)
      // console.log(tabList.find(tabList => tabList.id = 56))
      // this.$set(tabList.find(tabList => tabList.id = 56), 'like_num', 199)
    },
  }
};
</script>

<style lang="less" scoped>
.container {
  transition: all 0.8s linear;
  font-size: 14px;
  line-height: 24px;
  position: relative;
}
.home {
  padding-top: 120rpx;

  .top-barrage {
    width: 100%;
    height: 320rpx;
    overflow: hidden;
  }

  .card-bottom {
    width: 100%;

    .top-tab {
      display: flex;
      height: 120rpx;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 100;
      background-color: #ffffff;

      .tab-item {
        flex: 1;
        color: #999;
        border-bottom: 4rpx solid #ececec;
      }

      .active {
        color: var(--activeColor);
        border-bottom: 4rpx solid var(--activeColor);
      }
    }
  }
}
</style>
