<template>
  <view class="container" :style="{opacity:pageOpacity}">
    <view class="detail-wrap">
      <view @tap="clearReply">
        <view class="item-head">
          <view class="left-info">
            <view class="img-wrap flex-center" @tap="toOthers(detail.user_info.uuid)">
              <image :src="detail.user_info.avatar ? detail.user_info.avatar : defaultAvatar" mode="widthFix" class="avatar"></image>
            </view>
            <view class="head-box">
              <view class="head-name">{{ detail.user_info.username }}</view>
              <view class="head-bio">{{ detail.user_info.bio }}</view>
            </view>
          </view>

          <view style="margin-right: 30px;">
            <CcButton @cctap="showLoading('followLoading', 3000)" width="160rpx" height="60rpx" color="#fff" bgcolor="linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);"
                      :loading="followLoading" @tap="follow">{{followText}}</CcButton>
          </view>
        </view>

        <!-- 图 -->
        <view v-if="detail.poster_list.length">
          <view class="swiper-wrap">
            <swiper class="swiper-box" @change="swiperChange">
              <swiper-item v-for="(url, index) in detail.poster_list" :key="index" class="swipers flex-center">
                <image :src="url" mode="widthFix" @tap="viewImage(index, detail.poster_list)" class="img"></image>
              </swiper-item>
            </swiper>
            <div class="custom-indicator flex-center">{{ current+1 }} / {{ detail.poster_list.length }}</div>
          </view>
        </view>

        <!-- 内容 -->
        <view class="content-box" v-html="detail.title"></view>
        <!-- 分割线 -->
        <view class="bottom-time">
          <text v-if="detail.created_at">{{detail.created_at.substring(0, 10)}}</text>
        </view>
      </view>

      <view style="margin-top: 40px;margin-bottom: 30px" v-if="!hasLogin">
        <CcButton @cctap="showLoading('loginLoading', 3000)" width="500rpx"  color="#fff" bgcolor="linear-gradient(-45deg, rgba(246, 112, 79, 1) 0%, rgba(243, 49, 35, 1) 100%);"
                  :loading="loginLoading" @tap="toLogin">登录才能查看评论哦</CcButton>
      </view>

      <view v-else>
        <!-- 评论 -->
        <view class="comment-wrap" v-if="commentList && commentList.length > 0">
          <view class="scroll-wrap">
            <view class="top-num padding-tb">共{{commentList.length}}条评论</view>
            <template>
              <view class="comment-item margin-bottom-lg" v-for="(item, index) in commentList" :key="index">
                <view class="left-avatar" @tap="toOthers(item.user_info.uuid)">
                  <image class="avatar" :src="item.user_info.avatar ? item.user_info.avatar : defaultAvatar" mode="widthFix"></image>
                </view>
                <view class="right-box">
                  <view class="right-mine" @tap.stop="reply(item)">
                    <view class="right-top">
                      <p class="title">
                        {{ item.user_info.username }}
                        <text class="author" v-if="item.user_info.uuid == detail.user_info.uuid">作者</text>
                      </p>
                      <text class="time">{{item.created_at.substring(0, 10)}}</text>
                    </view>
                    <p class="content">{{ item.content }}</p>
                  </view>
                  <!-- 父级评论 -->
                  <template v-if="item.parent_info">
                    <view class="comment-item margin-top-sm">
                      <view class="left-avatar margin-right-sm" @tap="toOthers(item.parent_info.user_info.uuid)">
                        <image :src="item.parent_info.user_info.avatar ? item.parent_info.user_info.avatar : defaultAvatar" mode="widthFix" class="avatar"></image>
                      </view>
                      <view class="right-mine" @tap.stop="reply(item.parent_info)">
                        <view class="right-top">
                          <view class="reply">
                            <p class="title">{{ item.parent_info.user_info.username }}</p>
                            <text class="padding-lr-xs active">原评论</text>
                            <!-- <p class="title active">{{ item.user_info.username }}</p> -->
                          </view>
                          <text class="time">{{item.parent_info.created_at.substring(0, 10)}}</text>
                        </view>
                        <p class="content">{{ item.parent_info.content }}</p>
                      </view>
                    </view>
                  </template>
                </view>
              </view>
            </template>
          </view>
          <y-LoadMore :status="loadMoreStatus" />
        </view>
        <view class="comment-wrap" v-else v-show="requestStatus">
          <y-Empty emptyText="暂无评论哦"/>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="e-fixed_bottom e-bottom-btnGroup e-flex_center e-b-top">
        <view class="e-flex_left">
          <input type="text" v-model="commentVal" class="top-input" maxlength="128" confirm-type="send" @confirm="addCommon" :placeholder=placeholder />
        </view>
        <view class="e-flex_left">
          <view v-if="bottom.status.liked">
            <image src="/static/icon/zan_b.png" @tap="userAction('like')"></image>
          </view>
          <view v-else>
            <image src="/static/icon/zan.png" @tap="userAction('like')"></image>
          </view>
          <!--          <text>{{bottom.num.likeNum}}</text>-->
        </view>
        <view class="e-flex_left">
          <view v-if="bottom.status.collected">
            <image src="/static/icon/collect.png" @tap="userAction('collect')"></image>
          </view>
          <view v-else>
            <image src="/static/icon/collect_a.png" @tap="userAction('collect')"></image>
          </view>
          <!--          <text>{{bottom.num.collectedNum}}</text>-->
        </view>

        <view class="e-flex_left">
          <view>
            <image src="/static/icon/report_b.png" @tap=report()></image>
          </view>
        </view>
      </view>

      <!--   表情   -->
      <view style="display: none" class="emoji">
        <i>👸</i><i>👼</i><i>👮</i><i>👷</i><i>👳</i><i>👲</i><i>👱</i><i>👴</i><i>👵</i><i>👶</i><i>👨</i><i>👩</i><i>👧</i><i>👦</i><i>💅</i><i>💇</i><i>💆</i><i>💑</i><i>💏</i><i>🙇</i><i>💁</i><i>🙅</i><i>🙆</i>
        <i>😢</i><i>😣</i><i>😨</i><i>😰</i><i>😥</i><i>😖</i><i>😞</i><i>😌</i><i>😓</i><i>😏</i><i>😒</i><i>😝</i><i>😜</i><i>😁</i><i>😔</i><i>😳</i><i>😚</i><i>😘</i><i>😍</i><i>😉</i><i>😃</i><i>😊</i><i>😄</i>
        <i>💦</i><i>💨</i><i>💤</i><i>💢</i><i>🌟</i><i>💘</i><i>💓</i><i>💔</i><i>💚</i><i>💗</i><i>💜</i><i>💙</i><i>💛</i><i>👽</i><i>👿</i><i>😷</i><i>😪</i><i>😡</i><i>😠</i><i>😱</i><i>😲</i><i>😂</i><i>😭</i>
        <i>👯</i><i>💃</i><i>👫</i><i>🏃</i><i>🚶</i><i>💪</i><i>👏</i><i>🙏</i><i>🙌</i><i>👈</i><i>👉</i><i>👇</i><i>👆</i><i>👐</i><i>👋</i><i>👊</i><i>👌</i><i>👎</i><i>👍</i><i>💩</i><i>🔥</i><i>🎵</i><i>🎶</i>
        <i>👸</i><i>👼</i><i>👮</i><i>👷</i><i>👳</i><i>👲</i><i>👱</i><i>👴</i><i>👵</i><i>👶</i><i>👨</i><i>👩</i><i>👧</i><i>👦</i><i>💅</i><i>💇</i><i>💆</i><i>💑</i><i>💏</i><i>🙇</i><i>💁</i><i>🙅</i><i>🙆</i>
        <i>😢</i><i>😣</i><i>😨</i><i>😰</i><i>😥</i><i>😖</i><i>😞</i><i>😌</i><i>😓</i><i>😏</i><i>😒</i><i>😝</i><i>😜</i><i>😁</i><i>😔</i><i>😳</i><i>😚</i><i>😘</i><i>😍</i><i>😉</i><i>😃</i><i>😊</i><i>😄</i>
      </view>

    </view>
  </view>
</template>

<script>
import { getTimelineDetail, report } from '@/apis/timelines.js'
import { getInitStatus, like, dislike, collect, unCollect } from '@/apis/action';
import { followUser, followStatus } from '@/apis/users';
import { getAllComment, createComment } from '@/apis/comment';
import { mapState, mapActions } from 'vuex'
import CcButton from '@/components/cc-button/cc-button.vue'
import yEmpty from '../article/components/y-Empty/y-Empty'
import yLoadMore from "./components/y-LoadMore/y-LoadMore";

export default {
  data() {
    return {
      defaultAvatar: '/static/default_avatar.jpg',
      followLoading: false,
      loginLoading: false,
      title: '',
      actionType: 'timeline',
      pageOpacity: 0,
      detailId: '',
      detail: {},
      bottom:{
        num: {
          likeNum: 0,
          dislikeNum: 0,
          collectedNum: 0,
          commentNum: 0
        },
        status: {
          liked: false,
          disliked: false,
          collected: false,
          inMyFollows: false,
          inMyFans: false,
        }
      },
      actionFinish: false,
      followText: '关注',

      commentVal: '',
      current: 0,
      commentList: [],
      commentParentId: 0,
      placeholder: '写评论...',

      // 评论加载
      pageSize: 10,
      currentPage: 1,
      loadMoreStatus: 0,
      requestStatus: false,
    };
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin', 'statusH']),
  },
  components:{
    CcButton,
    yEmpty,
    yLoadMore
  },
  onShareAppMessage(res) {
    return {
      title: '干饭人日记',
      path: '/pages/article/details?id=' + this.detailId,
      imageUrl: '',
      desc: this.title,
    }
  },
  onLoad(options) {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    this.detailId = options.id
  },

  onReady(e) {
    this.pageOpacity = 1

    // 获取文章详情
    this.$loading('拼命拉取中...')
    getTimelineDetail(this.detailId).then(res => {
      this.$loading(false)
      this.detail = res.data
      this.bottom.num.likeNum = res.data.like_num
      this.bottom.num.dislikeNum = res.data.dislike_num
      this.bottom.num.collectedNum = res.data.collect_num
      this.bottom.num.commentNum = res.data.comment_num
      if (this.detail.title.length > 15) {
        this.title = this.detail.title.substring(0, 15) + '...'
      } else {
        this.title = this.detail.title
      }

      // 当前用户与我的互粉关系(匿名用户除外)
      if (this.hasLogin && res.data.user_info.uuid !== 'user-anonymous') {
        followStatus(res.data.user_info.uuid).then(followRes => {
          this.bottom.status.inMyFollows = followRes.data.inMyFollows
          this.bottom.status.inMyFans = followRes.data.inMyFans
          this.updateFollowText(this.bottom.status.inMyFans, this.bottom.status.inMyFollows)
        })
      }
    }).catch(err => {
      this.$loading(false)
    })

    // 获取底栏文字赞踩收藏状态
    if (this.hasLogin) {
      getInitStatus(this.detailId, this.actionType).then(res => {
        this.bottom.status.liked = res.data.liked
        this.bottom.status.disliked =res.data.disliked
        this.bottom.status.collected = res.data.collected
      })
    }

    // 获取评论
    if (this.hasLogin) {
      setTimeout(() => {
        this.getAllComment(this.currentPage)
      }, 1000);
    }
  },
  methods: {
    ...mapActions(['initLoginState']),

    // 底部操作栏
    userAction(action) {

      if (!this.hasLogin) {
        this.$toast('需要先登录呢')
        setTimeout(() => {
          this.$toLogin()
          this.followLoading = false
        }, 1000);
        return false
      }

      this.postAction(action).then(() => {
        this.actionFinish && this.postStatus(action)
      })
    },

    // 同步接口请求
    async postAction(action) {
      switch (action) {
        case 'like':
          await like(this.detailId, this.actionType).then(res => {
            this.actionFinish = true;
            this.$toast(res.message)
          }).catch(err => {
            console.log('err', err)
          })
          break;
        case 'dislike':
          await dislike(this.detailId, this.actionType).then(res => {
            this.actionFinish = true;
            this.$toast(res.message)
          }).catch(err => {
            console.log('err', err)
          })
          break;
        case 'collect':
          let data = {
            resource_uuid: this.detailId,
            type: this.actionType
          }
          if (this.bottom.status.collected) {
            // 取消收藏
            await unCollect(data.resource_uuid, data.type).then(res => {
              this.actionFinish = true;
              this.$toast(res.message)
            }).catch(err => {
              console.log('err', err)
            })
          } else {
            // 收藏
            await collect(data).then(res => {
              this.actionFinish = true;
              this.$toast(res.message)
            }).catch(err => {
              console.log('err', err)
            })
          }
          break;
        default:
          break;
      }
    },

    // 异步更新状态及数值
    postStatus(action) {
      switch (action) {
        case 'like':
          if (this.bottom.status.liked) {
            this.bottom.status.liked = false
            this.bottom.num.likeNum -= 1
          } else {
            this.bottom.status.liked = true
            this.bottom.num.likeNum += 1
          }
          break
        case 'dislike':
          if (this.bottom.status.disliked) {
            this.bottom.status.disliked = false
            this.bottom.num.dislikeNum -= 1
          } else {
            this.bottom.status.disliked = true
            this.bottom.num.dislikeNum += 1
          }
          break
        case 'collect':
          if (this.bottom.status.collected) {
            this.bottom.status.collected = false
            this.bottom.num.collectedNum -= 1
          } else {
            this.bottom.status.collected = true
            this.bottom.num.collectedNum += 1
          }
          break
        default:
          break
      }
    },

    // 获取评论列表,下拉刷新（时间排序）
    // TODO 热评、点赞 功能
    getAllComment(page) {
      if (this.loadMoreStatus === 2) {
        return false
      }
      this.loadMoreStatus = 1

      let that = this
      getAllComment(this.detailId, this.actionType, 'new', page).then(res => {
        that.loadMoreStatus = res.data.data.length < this.pageSize ? 2: 0
        that.commentList = that.commentList.concat(res.data.data)
        that.requestStatus = true
      })
    },
    onReachBottom() {
      this.currentPage = this.currentPage + 1
      setTimeout(() => {
        this.getAllComment(this.currentPage);
      }, 1000);
    },

    // 点击回复的效果 再评论框展示@xx
    reply(item) {
      this.commentParentId = item.id
      this.placeholder = '@'+item.user_info.username
    },
    clearReply() {
      this.commentParentId = 0
      this.placeholder = ''
    },
    // 写评论,动态加到评论列表最上方
    addCommon() {

      if (!this.hasLogin) {
        this.$toast('需要先登录呢')
        setTimeout(() => {
          this.$toLogin()
          this.followLoading = false
        }, 1000);
        return false
      }

      let data = {
        resource_uuid: this.detail.uuid,
        parent_id: this.commentParentId,
        content: this.commentVal,
        type: this.actionType,
      }
      createComment(data).then(res => {
        this.commentVal = ''
        this.commentParentId = 0
        this.commentList = [...res.data, ...this.commentList]
      })
    },

    // 举报
    report() {
      let that = this
      // 举报弹窗，举报理由
      if (!this.hasLogin) {
        this.$toast('需要先登录呢')
        setTimeout(() => {
          this.$toLogin()
          this.followLoading = false
        }, 1000);
        return false
      }

      uni.showModal({
        title: '我要举报',
        content: '本图文中包含违规内容?',
        cancelText: '违规举报',
        cancelColor: '#656464',
        confirmText: '点错了',
        success: function (res) {
          if (res.cancel) {
            report(that.detailId).then(res => {
              that.$toast('举报成功')
            })
          }
        },
      });
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
    swiperChange(e) {
      this.current = e.detail.current;
    },
    toOthers(uuid) {
      if (this.hasLogin) {
        uni.navigateTo({
          url: '/pages/mine/other?id='+uuid
        });
      } else {
        this.$toast('需要先登录呢')
        setTimeout(() => {
          this.$toLogin()
        }, 1000);
      }
    },

    toLogin() {
      setTimeout(() => {
        this.$toLogin()
        this.loginLoading = false
      }, 1000);
    },
    follow() {
      if (!this.hasLogin) {
        this.$toast('需要先登录呢')
        setTimeout(() => {
          this.$toLogin()
          this.followLoading = false
        }, 1000);
        return false
      }

      let that = this
      if (this.detail.user_info.uuid !== 'user-anonymous') {
        followUser(this.detail.user_info.uuid).then(res => {
          if (that.bottom.status.inMyFollows) {
            that.bottom.status.inMyFollows = false
          } else {
            that.bottom.status.inMyFollows = true
          }
          that.updateFollowText(this.bottom.status.inMyFans, this.bottom.status.inMyFollows)
          that.$toast(res.message)
          setTimeout(() => {
            that.followLoading = false
          }, 500);
        }).catch(err => {
          setTimeout(() => {
            that.followLoading = false
          }, 500);
        })
      } else {
        this.$toast('匿名用户无法被关注')
      }
    },

    // 更改按钮文本
    updateFollowText(inMyFans, inMyFollows) {
      if (inMyFollows) {
        if (inMyFans) {
          this.followText = '互相关注'
        } else {
          this.followText = '已关注'
        }
      } else {
        this.followText = '关注'
      }
    },
    showLoading(type, ttl = 3500) {
      this[type] = true
      setTimeout(() => {
        this[type] = false
      }, ttl);
    },
  }
};
</script>

<style lang="less" scoped>
.container {
  transition: all 0.5s linear;
  font-size: 14px;
  line-height: 24px;
  position: relative;
}
.detail-wrap {
  background-color: #ffffff;
  padding: 164rpx 0 100rpx;

  .item-head {
    display: flex;
    align-items: center;
    padding: 20rpx 40rpx;
    width: 100%;
    justify-content: space-between;
    //border-bottom: 1rpx solid var(--mainColor);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: #fff;
    height: 120rpx;

    .left-info {
      display: flex;
      align-items: center;

      .img-wrap {
        .avatar {
          width: 80rpx;
          height: 80rpx;
          //width: 100%;
          border-radius: 50%;
          border: 1rpx solid #ECECEC;
        }
      }
      .head-box {
        color: #999;
        font-size: 12px;
        line-height: 14px;
        padding-left: 40rpx;
        .head-name {

          color: #666666;
          font-size: 32rpx;
        }
        .head-bio {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:1;
          word-break:break-all;
          text-overflow:ellipsis;
          overflow:hidden;
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

  .swiper-wrap {
    position: relative;

    .swiper-box {
      margin: 0rpx 0 40rpx;
      height: 600rpx;
      background-color: var(--mainColor);
    }

    .custom-indicator {
      position: absolute;
      right: 10px;
      top: 10px;
      background: rgba(0, 0, 0, 0.5);
      padding: 3px 5px;
      border-radius: 12px;
      color: #fff;
    }
  }

  .content-box {
    padding: 0 40rpx;
    font-size: 32rpx;
    line-height: 50rpx;
  }

  .bottom-time {
    padding: 20rpx 40rpx;
    font-size: 24rpx;
    color: #999999;
  }

  .comment-wrap {
    background-color: #fff;
    padding: 0 40rpx 40rpx;

    .scroll-wrap {
      height: 100%;
      border-top: 1rpx solid #d5d5d4;
    }

    .comment-item {
      display: flex;
      justify-content: space-between;

      .left-avatar {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        overflow: hidden;
        border: 1rpx solid #ECECEC;

        .avatar {
          width: 100%;
        }
      }

      .right-box {
        margin-left: 20rpx;
        flex: 1;

        .right-mine {
          padding: 20rpx;
          background-color: #f5f8f9;
          border-radius: 10rpx;
          flex: 1;
        }

        .right-top {
          display: flex;
          justify-content: space-between;

          .reply {
            display: flex;
            font-size: 28rpx;
          }

          .active {
            color: var(--activeColor) !important;
          }

          .title {
            flex: 1;
            color: #000;

            .author {
              background-color: var(--activeColor);
              color: #ffffff;
              padding: 0 8rpx;
              margin-left: 10rpx;
              border-radius: 6rpx;
            }
          }

          .time {
            color: #999;
          }
        }

        .content {
          padding: 10rpx 0;
        }
      }
    }
  }

  .top-input {
    width: 300rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    background-color: #f5f5f5;
    color: #848383;
    border-radius: 80rpx;
    flex: 1;
  }
}

// 底部操作栏
.e-fixed_bottom{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  margin: 0 auto;
}
// 底部按钮栏
.e-bottom-btnGroup {
  height: 100rpx;
  background-color: #fff;
  padding: 12rpx 60rpx;
  image {
    height: 45rpx;
    width: 45rpx;
  }
}
// 上下居中
.e-flex_center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.e-b-top {
  background-image:
      linear-gradient(0deg, #efefef, 60%, transparent 40%),
      linear-gradient(90deg, transparent, transparent),
      linear-gradient(180deg, transparent, transparent),
      linear-gradient(270deg, transparent, transparent);
  background-repeat: no-repeat;
  background-position: top, right, bottom, left;
  background-size: 100% 1px, 0, 0, 0;
}
.e-flex_left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

// 表情块
.emoji {
  display: flex;
  flex-wrap: wrap;
  i {
    padding: 0 5px;
  }
}
</style>
