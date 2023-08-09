<template>
  <view>
    <web-view :src="webUrl" @message="message"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webUrl: '',
    };
  },
  onLoad(options) {
    console.log('link.vue-options:', options)
    this.webUrl = options.webUrl
  },
  methods: {
    message(event){
      console.log('message:', event.detail.data)
    }
  }
}

</script>