<template>
  <view class="container" :style="{opacity:pageOpacity}">

    <view style="position:absolute;z-index:12;" :style="{paddingTop: searchInput.top + 'px'}">
      <view :style="{width:searchInput.width+'px', height:searchInput.height+'px'}">
        <v-back></v-back>
      </view>
    </view>

    <view class="content">
      <!--  header  -->
      <view class="header-container">
        <view class="header">
          <view class="logo-img">
            <image src="/static/logo.jpg" mode="widthFix" lazy-load @load="onoff='1'" />
          </view>
        </view>
      </view>


      <view class="about">
        <view class="header"><span>用户协议：</span></view>
        <view class="chapter">
          <view>
            <p class="about-desc">尊敬的用户，欢迎使用干饭组提供的服务。在使用前请您阅读如下服务协议，使用本应用即表示您同意接受本协议，如有任何问题，可向干饭组咨询。</p>
            <dl>
              <dt class="h1">1. 服务条款的确认和接受</dt>
              <dd>通过访问或使用本应用，表示用户同意接受本协议的所有条件和条款。</dd>
            </dl>
            <dl>
              <dt class="h1">2. 服务条款的变更和修改</dt>
              <dd>干饭组有权在必要时修改服务条款，服务条款一旦发生变更，将会在重要页面上提示修改内容。如果不同意所改动的内容，用户可以放弃获得的本应用信息服务。如果用户继续享用本应用的信息服务，则视为接受服务条款的变更。本应用保留随时修改或中断服务而不需要通知用户的权利。本应用行使修改或中断服务的权利，不需对用户或第三方负责。</dd>
            </dl>
            <dl>
              <dt class="h1">3. 用户行为</dt>
              <dt class="h2">3.1 用户账号、密码和安全</dt>
              <dd>用户一旦注册成功，便成为干饭组的合法用户。同时，用户应采取合理措施维护其密码和帐号的安全。用户对利用该密码和帐号所进行的一切活动负全部责任；由该等活动所导致的任何损失或损害由用户承担，干饭组不承担任何责任。用户的密码和帐号遭到未授权的使用或发生其他任何安全问题，用户可以立即通知干饭组，并且用户在每次连线结束，应结束帐号使用，否则用户可能得不到干饭组的安全保护。对于用户长时间未使用的帐号，干饭组有权予以关闭并注销其内容。
              </dd>
            </dl>
            <dl>
              <dt class="h2">3.2 账号注册时的禁止行为</dt>
              <dd>（1）请勿以党和国家领导人或其他社会名人的真实姓名、字号、艺名、笔名注册；</dd>
              <dd>（2）冒充任何人或机构，或以虚伪不实的方式谎称或使人误认为与任何人或任何机构有关的名称；</dd>
              <dd>（3）请勿注册和其他网友之名相近、相仿的名字；</dd>
              <dd>（4）请勿注册不文明、不健康名字，或包含歧视、侮辱、猥亵类词语的名字；</dd>
              <dd>（5）请勿注册易产生歧义、引起他人误解的名字；</dd>
            </dl>
            <dl>
              <dt class="h2">3.3 用户在本应用上不得发布下列违法信息和照片：</dt>
              <dd>（1）反对宪法所确定的基本原则的；</dd>
              <dd>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</dd>
              <dd>（3）损害国家荣誉和利益的；</dd>
              <dd>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</dd>
              <dd>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</dd>
              <dd>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</dd>
              <dd>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</dd>
              <dd>（8）侮辱或者诽谤他人，侵害他人合法权益的；</dd>
              <dd>（9）含有法律、行政法规禁止的其他内容的；</dd>
              <dd>（10）禁止骚扰、毁谤、威胁、仿冒网站其他用户；</dd>
              <dd>（11）严禁煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；</dd>
              <dd>（12）严禁发布可能会妨害第三方权益的文件或者信息，例如（包括但不限于）：病毒代码、黑客程序、软件破解注册信息。</dd>
              <dd>（13）禁止上传他人作品。其中包括你从互联网上下载、截图或收集的他人的作品；</dd>
              <dd>（14）禁止上传广告、横幅、标志等网络图片；</dd>
            </dl>
            <dl>
              <dt class="h1">4. 上传或发布的内容</dt>
              <dd>用户上传的内容是指用户在干饭组上传或发布的视频或其它任何形式的内容包括文字、图片、音频等。除非干饭组收到相关通知，否则干饭组将用户视为其在本应用上传或发布的内容的版权拥有人。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。干饭组不承担任何法律及连带责任。</dd>
            </dl>
            <dl>
              <dd>对于经由本应用而传送的内容，干饭组不保证前述其合法性、正当性、准确性、完整性或品质。用户在使用本应用时，有可能会接触到令人不快、不适当或令人厌恶的内容。在任何情况下，干饭组均不对任何内容承担任何责任，包括但不限于任何内容发生任何错误或纰漏以及衍生的任何损失或损害。干饭组有权（但无义务）自行拒绝或删除经由本应用提供的任何内容。</dd>
            </dl>
            <dl>
              <dd>个人或单位如认为干饭组存在侵犯自身合法权益的内容，应准备好具有法律效应的证明材料，及时与干饭组取得联系，以便干饭组迅速作出处理。</dd>
            </dl>
          </view>
        </view>
      </view>
      <view class="about">
        <view class="header"><span>隐私条款：</span></view>
        <view class="chapter">
          <view>
            <dl>
              <dt class="h1">1.用户信息公开情况说明</dt>
              <dd>尊重用户个人隐私是干饭组的一项基本政策。所以，干饭组不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在本应用中的非公开内容，除非有下列情况：</dd>
              <dd>（1）有关法律规定或干饭组合法服务程序规定；</dd>
              <dd>（2）在紧急情况下，为维护用户及公众的权益；</dd>
              <dd>（3）为维护干饭组的商标权、专利权及其他任何合法权益；</dd>
              <dd>（4）其他需要公开、编辑或透露个人信息的情况；</dd>
            </dl>
            <dl>
              <dd>在以下（包括但不限于）几种情况下，干饭组有权使用用户的个人信息：</dd>
              <dd>（1）在进行促销或抽奖时，干饭组可能会与赞助商共享用户的个人信息，在这些情况下干饭组会在发送用户信息之前进行提示，并且用户可以通过不参与来终止传送过程；</dd>
              <dd>（2）干饭组可以将用户信息与第三方数据匹配；</dd>
              <dd>（3）干饭组会通过透露合计用户统计数据，向未来的合作伙伴、广告商及其他第三方以及为了其他合法目的而描述干饭组的服务；</dd>
            </dl>
            <dl>
              <dt class="h1">2.隐私权政策适用范围</dt>
              <dd>（1）用户在登录本应用服务器时留下的个人身份信息；</dd>
              <dd>（2）用户通过本应用服务器与其他用户或非用户之间传送的各种资讯；</dd>
              <dd>（3）本应用与商业伙伴共享的其他用户或非用户的各种信息；</dd>
            </dl>
            <dl>
              <dt class="h1">3.资讯公开与共享</dt>
              <dd>干饭组不会将用户的个人信息和资讯故意透露、出租或出售给任何第三方。但以下情况除外：</dd>
              <dd>（1）用户本人同意与第三方共享信息和资讯;</dd>
              <dd>（2）只有透露用户的个人信息和资讯，才能提供用户所要求的某种产品和服务;</dd>
              <dd>（3）应代表本应用提供产品或服务的主体的要求提供：根据法律法规或行政命令的要求提供;因外部审计需要而提供;用户违反了本应用服务条款或任何其他产品及服务的使用规定。</dd>
            </dl>
            <dl>
              <dt class="h1">4.账户删除申请</dt>
              <dd>用户有权在任何时候编辑用户在干饭组的帐户信息和资讯，用户也可以填写相关申请表格，要求删除个人帐户，但是用户无条件同意在你的帐户删除后，该帐户内及与该帐户相关的信息和资讯仍然保留在本网站档案记录中，除上述第三条规定的情况外，干饭组将为用户保密。</dd>
            </dl>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageOpacity: 0,
      searchInput: {
        width: 0,
        height: 0,
        top: 0,
        inputVal: ''
      },
    };
  },
  onLoad(e) {
    this.searchInput.width = this.$menuButtonRect.right - this.$menuButtonRect.width;
    this.searchInput.height = this.$menuButtonRect.height
    this.searchInput.top = this.$menuButtonRect.top
  },
  onReady(e) {
    this.pageOpacity = 1
  },

  methods: {
  }
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}
.container {
  transition: all 0.5s linear;
  font-size: 12px;
  line-height: 24px;
  position: relative;
  .content {
    padding: 0 32rpx;
    .header-container {
      .header {
        text-align: center;
        .logo-img {
          height: 68px;
          padding-top: 120rpx;
          image {
            width: 68px;
            height: 68px;
            border-radius: 50%;
          }
        }
      }
      .title {
        margin-top: 12px;
        text-align: center;
        font-size: 16px;
      }
    }

    .about {
      margin-top: 60rpx;
      .header{
        display: inline-block;
        position: relative;
        font-size: 32rpx;
        font-weight: bold;

        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 12rpx;
          background-color: #fdefec;
        }
        span{
          position: relative;
          z-index: 2;
        }
      }
      .chapter{
          position: relative;
          margin-bottom: 20rpx;
          padding: 24rpx;
          color: #666;
      }
      .h1 {
        font-size: 16px;
        color: #444343;
        margin-top: 10px;
      }
      .h2 {
        font-size: 14px;
        color: #444343;
        margin-top: 5px;
      }
    }
  }
}
</style>
