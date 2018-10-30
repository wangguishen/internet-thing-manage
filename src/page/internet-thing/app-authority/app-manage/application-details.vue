<template>
	<div class="appDetails">
		<div class="header">
			<el-row>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple">
			  		<el-row class="grid-content bg-purple">
			  			<el-col :span="2">
			  				<div style="height:40px;">
			  					<template v-if="appIcon != ''">
					      		<img class="iconImg" :src="appIcon" alt="" onerror="onerror=null;this.src='/static/image/applyApp.png'">
					      	</template>
					        <template v-else>
					        	<img class="iconImg" src="static/image/applyApp.png" alt="">
					        </template>
			  				</div>
			  			</el-col>
			  			<el-col class="ovHid" :span="20">
			  				<div>
			  					<el-row style="margin-left:10px; text-align:left;" align="top">
			  						<el-col :span="20">
			  							<div style="height:20px;"><span v-text="appName"></span> <span v-text="packageName"></span></div>
			  						</el-col>
			  						<el-col :span="8">
			  							<div style="height:20px;font-size:14px;color:#ccc;">累计下载次数:<span v-text="downloadTime"></span></div>
			  						</el-col>
			  					</el-row>
			  				</div>
			  			</el-col>
			  		</el-row>
			  	</div>
		  	</el-col>
			  <el-col :span="8">
			  	<div class="grid-content bg-purple-light">
			  		<template v-if="rowDetails.state=='正常'">
			  			<el-button class="s-four-text-btn" type="primary" size="mini" @click="appRemove">应用下架</el-button>
							<el-button class="s-four-text-btn" type="primary" size="mini" @click="uploadNewEdition">上传新版</el-button>
			  		</template>
				  	<template v-else>
				  		<el-button class="s-four-text-btn" type="primary" size="mini" @click="appPut">重新上架</el-button>
				  	</template>
						<el-button type="info" size="mini" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="detailContent">
			<el-form :model="detailForm" ref="detailForm" class="g-form-ipt">
			  <el-form-item label="版本名称：" :label-width="formLabelWidth">
			    <el-input class="g-item-ipt" v-model="detailForm.versionName" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="版本编号：" :label-width="formLabelWidth">
			    <el-input class="g-item-ipt" v-model="detailForm.versionNumber" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="大小：" :label-width="formLabelWidth">
			    <el-input class="g-item-ipt" v-model="detailForm.size" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="是否强制升级：" :label-width="formLabelWidth">
			    <el-input class="g-item-ipt" v-model="detailForm.foceUpgrade" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="上传时间：" :label-width="formLabelWidth">
			    <el-input class="g-item-ipt" v-model="detailForm.uploadTime" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="所属公司：" :label-width="formLabelWidth">
			    <el-input class="g-item-ipt" v-model="detailForm.companyName" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="版本说明：" :label-width="formLabelWidth">
				    <el-input type="textarea" v-model="detailForm.editionState" :disabled="true" autosize></el-input>
		  	</el-form-item>
		  	<el-form-item>
			    <el-button style="margin-left:120px;" size="mini" type="primary" @click="downloadAPK">下载</el-button>
			    <el-button style="background:#fff;border:1px solid #ee4442;color:#ee4442;" size="mini" type="primary" @click="deleteForm('ruleForm')">删除</el-button>
			  </el-form-item>
			</el-form>
		</div>	
		<canvas ref="canvas" style="height: 0"></canvas>
		<!-- 删除弹框 -->
		<el-dialog class="g-sdk-details-box" width="26%" top="25vh" :visible.sync="dialogDeleteVisible">
			<div slot="title" class="dialog-title">
		  	<span class="s-pass-text">提示</span>
	    </div>
	    <div class="s-pass-container">
	    	确定删除此应用吗？
	    </div>
			<div slot="footer" class="dialog-footer">
		    <el-button size="mini" class="s-yes-bg-ga-btn" type="info" @click="deleteCancel()">取 消</el-button>
		    <el-button size="mini" class="s-pass-sure" type="primary" @click="deleteSure()">确 定</el-button>
		  </div>
		</el-dialog> 
		<!-- 上下架弹框 -->
		<el-dialog class="g-sdk-details-box" width="26%" top="25vh" :visible.sync="dialogAppRemoveVisible">
			<div slot="title" class="dialog-title">
		  	<span class="s-pass-text" v-text="dialogTitle"></span>
	    </div>
	    <div class="s-pass-container" v-text="dialogContent"></div>
			<div slot="footer" class="dialog-footer">
		    <el-button size="mini" class="s-yes-bg-ga-btn" type="info" @click="appRemovePutCancel()">取 消</el-button>
		    <el-button size="mini" class="s-pass-sure" type="primary" @click="appRemovePutSure()">确 定</el-button>
		  </div>
		</el-dialog> 
	</div>
</template>
<script>
import {getToken, setToken} from '@/util/storageUtil'
import {changePageSize} from '@/util/numberUtil'
import {verServer} from '@/service/list'
export default {
	data () {
		return {
			appIcon: '',
			downloadTime: '',
			appName: '',
			packageName: '',
			formLabelWidth: '120px',
			detailForm: {
				versionName: '', //版本名称
				versionNumber: '', //版本号
				size: '',
				downloads: '', //下载次数
				foceUpgrade: '', //是否强制升级
				uploadTime: '',
				companyName: '',
				editionState: '' //版本说明
			},
			rowDetails: {}, //单条应用信息
			dialogDeleteVisible: false, //删除弹框
			dialogAppRemoveVisible: false, //下架弹框
			dialogTitle: '', //上下架弹框标题
			dialogContent: '' //上下架提示内容
		}
	},
	mounted () {
		let self = this;
		self.rowDetails = getToken('singleRowDetails', 'json')
		self.rowDetails.needUpdate = self.rowDetails.needUpdate === 0 ? '不强制' : '强制'
		self.appIcon = self.rowDetails.iconUrl;
		self.appName = self.rowDetails.appName;
		self.packageName = self.rowDetails.pkgName;
		self.downloadTime = self.rowDetails.downloadTimes;
		self.detailForm.versionName = self.rowDetails.latestVerName;
		self.detailForm.versionNumber = self.rowDetails.latestVerCode;
		self.detailForm.size = changePageSize(self.rowDetails.pkgSize, 1);
		self.detailForm.downloads = self.rowDetails.downloadTimes;
		self.detailForm.foceUpgrade = self.rowDetails.needUpdate;
		self.detailForm.uploadTime = self.rowDetails.pubTime;
		self.detailForm.companyName = self.rowDetails.merName;
		self.detailForm.editionState = self.rowDetails.releaseNotes;
	},
	methods: {
		async appRemovePut (data, type) { //上下架公共方法
			let self = this;
			let resAppData = await verServer(data)
			if (resAppData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (resAppData.status == 200 && resAppData.data.retCode == 0) {
				if (type == 'down') {
					self.$message.success({
	        	type: 'success',
	        	message: '下架成功!'
	        });
	        self.$router.push('/applicationList')
				} else if (type == 'put') {
					self.$message.success({
	        	type: 'success',
	        	message: '重新上架成功!'
	        });
	        self.$router.push('/applicationList')
				}
			} else {
				self.$message.error(resAppData.data.errMsg)
			}
		},
		appRemovePutCancel () { //取消上下架
			let self = this;
			if (self.rowDetails.state == '正常') {
				self.$message.warning('已取消下架')
			} else {
				self.$message.warning('已取消重新上架')
			}
			self.dialogAppRemoveVisible = false;
		},
		appRemovePutSure () { //确认上下架
			let self = this;
			if (self.rowDetails.state == '正常') {
				let removeData = {
					"commandId": 0x0507,
					"reqNode": "WEB",
					"body": {
						"appId": self.rowDetails.appId,
						"merId": self.rowDetails.merId,
						"action": 0 //表示下架
					}
				}
				self.appRemovePut(removeData, 'down')
			} else {
				let putData = {
					"commandId": 0x0507,
					"reqNode": "WEB",
					"body": {
						"appId": self.rowDetails.appId,
						"merId": self.rowDetails.merId,
						"action": 1 //表示上架
					}
				}
				self.appRemovePut(putData, 'put')
			}
		},
		appRemove () { //应用下架
			let self = this;
			self.dialogAppRemoveVisible = !self.dialogAppRemoveVisible;
			self.dialogTitle = '应用下架';
			self.dialogContent = '确认下架此应用吗？';
		},
		appPut () { //重新上架
			let self = this;
			self.dialogAppRemoveVisible = !self.dialogAppRemoveVisible;
			self.dialogTitle = '重新上架';
			self.dialogContent = '确认上架此应用吗？';
		},
		deleteCancel () { //取消删除
			let self = this;
			self.dialogDeleteVisible = false;
			self.$message.warning('已取消删除')
		},
		async deleteSure () { //确认删除
			let self = this;
			let deleteData = {
				"commandId": 0x0521,
				"reqNode": "WEB",
				"reqBody": {
					"appId": self.rowDetails.appId,
					"verCode": self.rowDetails.latestVerCode
				}
			}
			let deleteAppResData = await verServer(deleteData);
			if (deleteAppResData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (deleteAppResData.status == 200 && deleteAppResData.data.retCode == 0) {
    		self.$message.success('删除成功');
        self.$router.push('/applicationList')
    	} else {
    		self.$message.error(deleteAppResData.data.errMsg)
    		self.dialogDeleteVisible = false;
    	}
		},
		deleteForm () { //删除应用
			let self = this;
			self.dialogDeleteVisible = !self.dialogDeleteVisible;
		},
		downloadAPK () { //下载APK
			let self = this;
			window.location = self.rowDetails.downloadAddr
		},
		uploadNewEdition () { //上传新版
			let self = this;
			setToken('ChangeAppState', 'reUpload')
			self.$router.push('/addApplication')
		},
		back () { //返回上一页
			let self = this;
			self.$router.push('/applicationList')
		}
	}
}
</script>
<style lang="scss" scoped>
	.appDetails {
		.header {
			margin-bottom:10px;
			.iconImg {
				width: 40px;
			}
			.el-row {
	    	margin-bottom: 20px;
	    	&:last-child {
	      	margin-bottom: 0;
	    	}
	    	.bg-purple {
			    // background: #d3dce6;
			    height: 40px;
			  }
			  .bg-purple-light {
			    // background: #e5e9f2;
			    height: 40px;
			    float:right;
			  }
	  	}
		}
  	.detailContent {
  		background-color:#fff;
			border-radius:3px;
			padding:10px 0;
			.el-form {
				.el-form-item {
					text-align:left;
					.el-input {
						width: 50%;
						.el-input__inner {
							height: 30px;
    					line-height: 30px;
						}
					}
					.el-textarea {
						width: 50%;
					}
				}
			}		
  	}
  	.g-sdk-details-box{
			text-align: left;
			.g-sdk-details-ipt{
				width: 80%;
			}
			.el-dialog{
				.el-dialog__body{
					padding: 25px 15px;
					.s-no-pass-cause{
						padding-left: 20px;
					}
				}
				.dialog-title{
					.s-pass-text{
						margin-left: 20px;
					}
				}
				.s-pass-container{
					text-align: center;
					font-size: 18px;
					padding: 15px 0;
				}
				.dialog-footer{
					margin-bottom: 20px;
					.s-yes-bg-ga-btn{
						margin-right: 20px;
					}
					.s-pass-sure{
						margin-left: 20px;
					}
				}
			}
		}
	}
	.ovHid .el-col-20 {
		overflow:hidden;
	}
</style>