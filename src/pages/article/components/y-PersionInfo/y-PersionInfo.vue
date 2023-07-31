<template>
  <view class="info-wrap">
    <view class="top-box flex-center">
      <image :src="info.avatar ? info.avatar : defaultAvatar" mode="widthFix" class="filter"></image>
    </view>
    <view class="mine-top">
      <view class="avatar-wrap">
        <view class="avatar flex-center">
          <image :src="info.avatar ? info.avatar : defaultAvatar" mode="widthFix" class="img"></image>
        </view>
        <view class="cu-tag badge ycShake" :class="info.gender === 'male' ? 'cuIcon-male bg-blue' : 'cuIcon-female bg-pink'"></view>
        <view class="name">
          <p>{{ info.name }}</p>
          <p class="motto" @tap="showBio">{{ info.bio }}</p>
        </view>
      </view>
    </view>
    <view class="top-menu">
      <view class="menu-box flex-center" @tap="handleMenu('id')">
        <text class="title">{{ info.id }}</text>
        <text>ID</text>
      </view>

      <view class="menu-box flex-center" @tap="handleMenu('follow')">
        <text class="title">{{ info.followed_num }}</text>
        <text>关注</text>
      </view>

      <view class="menu-box flex-center" @tap="handleMenu('fans')">
        <text class="title">{{ info.fans_num }}</text>
        <text>粉丝</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      defaultAvatar: '/static/default_avatar.jpg',

      menuList: [{
        name: '喜欢',
        num: 20
      }, {
        name: '关注',
        num: 20
      }, {
        name: '粉丝',
        num: 20
      }]
    };
  },
  methods:{
    handleMenu(index){
      this.$emit('change',index)
    },
    showBio() {
      this.$toast(this.info.bio)
    }
  }
};
</script>

<style lang="less" scoped>
.info-wrap {
  position: relative;

  .top-box {
    position: absolute;
    top: 0;
    width: 100%;
    height: 400rpx;
    overflow: hidden;
    border-radius: 0 0px 100rpx 100rpx;

    .filter {
      width: 100%;
      filter: brightness(0.8) blur(10rpx);
    }
  }

  .mine-top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 40rpx 20rpx;
    border-radius: 0 0px 100rpx 100rpx;
    height: 400rpx;

    .avatar-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 40rpx 20rpx;

      .cu-tag{
        top: 0;
        left: 110rpx;
      }

      .avatar {
        position: relative;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100rpx;
          overflow: hidden;
          border-radius: 50%;
        }
      }

      .name {
        width: 520rpx;
        overflow: hidden;
        font-size: 36rpx;
        color: #fff;
        padding-left: 40rpx;

        .motto {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 24rpx;
        }
      }
    }

    .fans-item {
      display: flex;
      align-items: center;
      width: 100%;

      .item {
        display: flex;
        flex-direction: column;
        flex: 1;
        color: #ffffff;
        text-align: center;
        font-size: 32rpx;

        .title {
          font-size: 32rpx;
          font-family: aliM;
          padding-top: 20rpx;
        }
      }
    }
  }

  .top-menu {
    position: absolute;
    right: 40rpx;
    left: 40rpx;
    bottom: -80rpx;
    height: 180rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 40rpx;
    color: var(--mainColor);
    background-color: #fff;
    border-radius: 16rpx;
    line-height: 46rpx;
    text-align: left;
    font-size: 28rpx;

    .menu-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      font-size: 24rpx;

      .title {
        color: var(--activeColor);
        font-size: 48rpx;
        padding-bottom: 20rpx;
      }
    }
  }
}
</style>
