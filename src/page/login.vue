<template>
	<div class="login-page">
		<div class="ms-bgc">
			<div class="inputField">
				<div class="title">框架管理系统</div>
				<div class="inputBox">
          <div class="iptAcc">
          	<div class="marked">
          		<i style="display: inline-block;float: left;" class="iconfont" v-show="iconShow" :class="{'iconColor':iconColor}">&#xe8e5;</i>
							<p style="display: inline-block;float: left;line-height: 0;" v-text="iptMark"></p>
						</div>
          	<el-input
          		class="ipt-hgt"
						  :placeholder="account"
						  v-model="inputAccount"
						  @click.native="iptName('a')"
						  @keyup.tab.native="iptName('a')"
						  @keyup.enter.native="submit()"
						  clearable>
						  <span class="iconfont el-input__icon" slot="prefix">&#xe634;</span>
						</el-input>
          </div>
          <div class="iptPwd">
						<el-input
							class="ipt-hgt"
						  :placeholder="password"
						  v-model="inputPassword"
						  @click.native="iptName('b')"
						  @keyup.tab.native="iptName('b')"
						  @keyup.enter.native="submit()"
						  :type="pwdType">
						  <span class="iconfont el-input__icon" slot="prefix">&#xe614;</span>
						  <span style="cursor: pointer;" @click="handleClose" class="iconfont el-input__icon" slot="suffix" v-show="closeEye">&#xe6e1;</span>
						  <span style="cursor: pointer;" @click="handleClose" class="iconfont el-input__icon" slot="suffix" v-show="!closeEye">&#xe600;</span>
						</el-input>
					</div>
					<div class="iptSecode">
						<el-input
							class="ipt-hgt"
						  :placeholder="marked"
						  v-model="inputSecode"
						  @click.native="iptName('c')"
						  @keyup.tab.native="iptName('c')"
						  @keyup.enter.native="submit()">
						  <span :class="{'bgcIcon':bgcIcon}" class="iconfont el-input__icon" slot="prefix">&#xe633;</span>
								
						</el-input>
						<div style="cursor:pointer;" class="codeImg">
							<img @click="changeCode" style="width:100%;height:40px;" :src="codeSrc">
						</div>
					</div>
					<div class="iptBtn">
						<el-button type="primary" @keyup.tab.native="iptName('d')" @click="submit()" @keyup.enter="submit()" element-loading-text="加载中" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {submitLogin, ValiCodeUrl} from '@/service/iot-frame'
import md5 from 'js-md5'
import {setLocalStorage} from '@/util/storageUtil'
	export default {
		data () {
			return {
				ruleForm: {
					account: '',
					password: ''
				},
				codeSrc: ValiCodeUrl, //验证码地址
				rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        },
        fullscreenLoading: false, //全屏显示加载
        inputAccount: '', //账号
        inputPassword: '', //密码
        inputSecode: '', //验证码
        iptMark: '', //提示语
				account: '请输入账号',
				password: '请输入密码',
				marked: '请输入验证码',
				closeEye: true, //是否查看密码
				pwdType: 'password', //密码是否显示类型
				showMessage: false, //是否显示
				checkCode: '', //验证码随机生成值
				bgcIcon: false,
				iconShow: false,
				iconColor: false
			}
		},
		mounted () {
			let self = this;
			self.codeSrc = ValiCodeUrl + '?rnd=' + Math.random();
		},
		methods: {
			iptName (sub) {
      	let self = this;
      	if (sub == 'a') {
          self.account = '';
          self.password = '请输入密码';
          self.marked = '请输入验证码';
      	} else if (sub == 'b') {
          self.password = '';
          self.account = '请输入账号';
          self.marked = '请输入验证码';
      	} else if (sub == 'c') {
          self.marked = '';
          self.account = '请输入账号';
          self.password = '请输入密码';
      	} else {
          self.account = '请输入账号';
          self.password = '请输入密码';
          self.marked = '请输入验证码';
      	}
  		},
  		handleClose () { //点击切换显示密码
  			let self = this;
  			self.closeEye = !self.closeEye;
  			self.pwdType = self.pwdType === 'password' ? 'text' : 'password';
  		},
  		changeCode () {
  			let self = this;
  			self.codeSrc = ValiCodeUrl + '?rnd=' + Math.random();
  		},
			async submit () { //登录
				let self = this;
				if (self.inputAccount == '') {
					self.iconShow = true;
					self.iconColor = true;
					self.iptMark = '请输入账号'
				} else if (self.inputPassword == '') {
					self.iconShow = true;
					self.iconColor = true;
					self.iptMark = '请输入密码'
				} else if (self.inputSecode == '') {
					self.iconShow = true;
					self.iconColor = true;
					self.iptMark = '请输入验证码60s有效'
				} else {
					self.iptMark = '';
					self.iconShow = false;
					self.fullscreenLoading = true;
					let data = {
						'userName': self.inputAccount,
						'password': md5(self.inputPassword),
						'code': self.inputSecode,
						'platform': '0' //平台管理员0
					}
					let resData = await submitLogin(data);
					if (resData.status == 200 && resData.data.message === "success") {
						self.fullscreenLoading = false;
						self.$message.success('登录成功')
						setLocalStorage('USER_INFO', resData.data.data) //存储登录账号信息
						setLocalStorage('sessionId', resData.data.data.umssessionId)
						self.$router.push('/internet-thing/index') //物联框架首页
					} else {
						self.$message.error(resData.data.message)
						self.codeSrc = ValiCodeUrl + '?rnd=' + Math.random();
						self.fullscreenLoading = false;
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped> 
	.login-page,.ms-bgc{
		width:100%;
    height:100%;
	}
	.ms-bgc{
		background: url("../../static/image/background.png") no-repeat;
		background-size: 100% 100%;
	}
	.inputField {
		/*width: 400px;*/
		width: 400px;
		height: 350px;
		height: 400px;
		background: #e9ebf0;
		position: fixed;
		top: 48%;
		left: 50%;
		margin-left: -200px;
		margin-top: -210px;
		border-radius: 5px;
    border: 1px solid #aaa;
    padding: 10px 50px;
    box-sizing: border-box;
		/*position: relative;*/
		/*top: 40%;*/
	}
	.inputField .title {
		/*position: absolute;*/
		/*right:40%;*/
    /*top:20%;*/
    color: #243a60;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin: 40px 0 20px;
	}
	.inputField .marked {
		width: 100%;
		/*background: #fff;*/
		height: 30px;
		border-radius: 5px;
	}
	.inputField .marked p {
		color: red;
		background: #e9ebf0;
		font-size: 14px;
	}
	.inputField .inputBox {
		/*position: absolute;*/
    /*right:40%;*/
    /*top:40%;*/
    width:100%;
    height:250px;
    /*margin:-150px 0 0 -190px;*/
    /*padding:40px;*/
    /*margin-top: 20px;*/
	}
	.ipt-hgt {
		height: 40px;
	}
	.inputBox .iptAcc {
		/*position: fixed;*/
		width: 100%;
		margin: 15px 0;
		/*margin: 0 auto;*/
	}
	.iptPwd {
		/*position: fixed;*/
		margin: 15px 0;
		width: 100%;
	}
	.iptSecode {
		/*position: fixed;*/
		/*display: inline-block;*/
		/*float: left;*/
		width: 100%;
		margin: 15px 0;
	}
	.iptSecode .el-input{
		width: 66%;
	}
	.iptSecode .codeImg {
		display: inline-block;
		float: right;
		background: #fff;
		width: 34%;
		height: 40px;
		border-radius: 0 5px 5px 0;
	}
	.codeImg .el-button {
		width: 100%;
		height: 100%;
		background: #3e69b3;
		color: #fff;
		font-size: 24px;
		font-weight: bold;
		padding: 7px 10px;
	}
	.iptSecode .iptBtn {
		width: 100%;
		margin-top: 15px 0;
	}
	.iptBtn .el-button{
		width: 100%;
	}
	.bgcIcon{
		color: green;
	}
	.iconColor {
		color: red;
	}
	.el-loading-mask {
		background-color:rgba(153, 204, 255, 0.9);
	}
</style>