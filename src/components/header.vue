<template>
	<div>
		<div class="g-left table-cell fl">
			<img src="static/image/LOGO.png" alt=".." class="middle">
			<img src="static/image/juxing.png" alt=".." class="middle">
			<span>框架管理系统</span>
		</div>
		<div class="g-right fl">
			<div class="fr" @mouseout="hide" @mouseover="show" transition="bounce" stagger="400">
				<span class="fr">{{account}}</span>
				<ul v-show="isShow">
					<!-- <router-link to="/portShow">
					  <li>算法调用</li>
					</router-link> -->
					<li @click="loginOut">退出登录</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import {getLocalStorage, clearStorage} from '@/util/storageUtil'
import { loginOut } from '@/service/iot-frame'
export default {
	data () {
		return {
			account: '',
			isShow: false
		}
	},
	mounted () {
		let self = this;
		// let userInfo = getLocalStorage('USER_INFO', 'json')
		// self.account = userInfo.userName || userInfo.account
	},
	methods: {
		hide () {
			let self = this
			self.isShow = false
		},
		show () {
			let self = this
			self.isShow = true
		},
		async loginOut () {
			let self = this
			let paramData = ''
			let resData = await loginOut(paramData)
			if (resData.status == 200 && resData.data.status === '200') {
        clearStorage()
				self.$router.push('/login')
      } else {
        self.$message.error(resData.data.message)
      }
		}
	}
}
</script>
<style lang="scss" scoped>
  $fontColor: #fefefe;
  $h_17: 17px;
	.g-left {
		width: 40%;
		margin-left: 20%;
		img:nth-child(1) {
		  margin-left: 8px;
		  width: 75px;
		  height: $h_17;
		}
		img:nth-child(2) {
			height: $h_17;
			padding: 0 5px 0 5px;
		}
 		span {
			color: $fontColor;
		}
	}
	.g-right {
		width: 20%;
		img {
			margin-top: 15px;
			width: 30px;
			height: 30px;
		}
		span {
		  color: $fontColor;
		  font-size: 12px;
		  padding-left: 10px;
		}
		div:nth-child(1) {
			width: 95px;
			height: 60px;
		}
		ul {
	    width: 95px;
	    height: 75px;
	    position: relative;
	    top: 0;
	    left: 18px;
	    float: right;
	    line-height: 24px;
	    z-index: 10000;
	    li {
	    	text-align: center;
	    	height: 50%;
	    	font-size: 12px;
	    	line-height: 37.5px;
	      cursor: pointer;
	    }
	    li:nth-child(1) {
	    	background: #2f3843;
	    	color: #fff;
	    }
	    li:nth-child(2) {
	    	background: #3b434e;
	    	color: #bec4ca;
	    }
		}
		span:after {
			content: "";
			position: relative;
			left: 8px;
			top: 10px;
			border: 1px solid #fff;
			width:0;
	    border-width:7px;
	    border-style:solid;
	    border-color:#8692a0 transparent transparent transparent;
		}
	}
</style>