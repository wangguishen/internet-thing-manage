<template>
  <div>
    <div class="g-ter grid pointer">
      <div :class="isInternetThing ? 's-icon-check' : 's-icon-default'" @click="change(true)"></div>
      <span :class="isInternetThing ? 's-span-check' : 's-span-default'" @click="change(true)">物联框架</span>
    </div>
    <div class="g-cau grid pointer">
      <div :class="isInternetThing ? 's-icon-default' : 's-icon-check'" @click="change(false)"></div>
      <span :class="isInternetThing ? 's-span-default' : 's-span-check'" @click="change(false)">计算框架</span>
    </div>
  </div>
</template>
<script>
import {getToken, setToken, removeToken} from '@/util/storageUtil'
export default {
  data () {
    return {
      isInternetThing: true
    }
  },
  watch: {
    '$route': {
      handler: function (val, oldval) {
        if (val.fullPath === '/adminList') {
          this.isInternetThing = false
        }
      }
    }
  },
  mounted () {
    let self = this;
    let status = getToken("IS_INTERNET_STATUS")
    if (status) {
      if (status === '0') self.isInternetThing = true
      else self.isInternetThing = false
    }
  },
  methods: {
    change (status) {
      let self = this
      self.isInternetThing = status
      removeToken("APP_ACCREDIT_STATUS")
      removeToken('MER_DATA')
      if (status) {
        setToken("IS_INTERNET_STATUS", '0')
        self.$router.push('/internet-thing/index')
      } else {
        setToken("IS_INTERNET_STATUS", '1')
        self.$router.push('/calculate/index')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .g-ter {
    margin-top: 62px;
  }
  .g-cau {
    margin-top: 20px;
  }
  .g-ter, .g-cau {
    .s-icon-check, .s-icon-default {
      margin-top: 3.5px;
    }
    span {
      padding-left: 20px;
      font-size: 14px;
    }
  }
  
  $checkColor: #8d0000;
  $defaultColor: #6d6d6d;
  .s-icon-check {
    width: 14px;
    height: 14px;
    background: $checkColor;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .s-icon-default {
    width: 8px;
    height: 8px;
    border: 3px $defaultColor solid; 
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  .s-span-check {
    color: $checkColor;
  }

  .s-span-default {
    color: $defaultColor;
  }
</style>