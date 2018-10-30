<template>
	<div class="addApp">
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/applicationList'}">应用列表</el-breadcrumb-item>
				  <el-breadcrumb-item v-text="secLevel"></el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="back()">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
			<div class="addAppContent">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="g-form-ipt">
					<el-form-item class="compSelect" label="所属公司：" :label-width="formLabelWidth" prop="compCode">
						<el-cascader
	            :options="compOptions"
	            v-model="selectedOptions"
	            @change="compOptionsChange"
	            change-on-select
	            filterable
	            clearable
	            :props="props"
	            style="width: 50%"
	            placeholder="请选择公司">
	          </el-cascader>
					</el-form-item>
				  <el-form-item label="上传应用：" prop="APK" :label-width="formLabelWidth">
				    <el-input class="g-item-ipt" v-model="ruleForm.APK" placeholder="请选择要上传的应用包" ></el-input>
				    <el-upload
				    	style="display:inline-block;"
						  class="upload-demo"
						  ref="upload"
						  name="fileapk"
						  :data="dataForm"
						  :action="action"
						  :on-change="handleChange"
						  :before-upload="beforeUpload"
						  :on-success="success"
						  :file-list="fileList"
						  :auto-upload="false"
						  :show-file-list="false"
						  :limit="1"
						  :on-exceed="handleExceed">
						  <el-button type="info" @click="selectAPK" size="mini">选择</el-button>
						</el-upload>
						<el-button type="primary" @click="uploadAPK" size="mini" element-loading-text="上传中" v-loading.fullscreen.lock="fullscreenLoading" :disabled="disabled">上传</el-button>
				  </el-form-item>
				  <el-form-item label="应用图标：" prop="icon" :label-width="formLabelWidth">
				    <div style="width:35px;height:35px;border:1px dashed #ccc;line-height:35px;">
				    	<img style="width:35px;height:35px;" :src="ruleForm.icon" onerror="onerror=null;this.src='/static/image/plus.png'"
	>
				    </div>
				  </el-form-item>
				  <el-form-item label="应用名称：" prop="name" :label-width="formLabelWidth">
				    <el-input class="g-item-ipt" v-model="ruleForm.name" :maxlength="NAME_MAX_LENGTH"></el-input>
				  </el-form-item>
				  <el-form-item label="应用包名：" prop="package" :label-width="formLabelWidth" :maxlength="NAME_MAX_LENGTH">
				    <el-input class="g-item-ipt" v-model="ruleForm.package"></el-input>
				  </el-form-item>
				  <el-form-item label="应用大小：" prop="size" :label-width="formLabelWidth">
				    <el-input class="g-item-ipt" v-model="ruleForm.size"></el-input>
				  </el-form-item>
				  <el-form-item label="版本名称：" prop="versionName" :label-width="formLabelWidth">
				    <el-input class="g-item-ipt" v-model="ruleForm.versionName" :disabled="true"></el-input>
				  </el-form-item>
				  <el-form-item label="版本编号：" prop="versionNumber" :label-width="formLabelWidth">
				    <el-input class="g-item-ipt" v-model="ruleForm.versionNumber" :disabled="true"></el-input>
				  </el-form-item>
				  <el-form-item label="是否强制升级：" prop="foceUpgrade" :label-width="formLabelWidth">
				    <el-radio-group v-model="ruleForm.foceUpgrade">
				      <el-radio label="是"></el-radio>
				      <el-radio label="否"></el-radio>
				    </el-radio-group>
				  </el-form-item>
				  <el-form-item label="应用是否公测版：" prop="publicBeta" :label-width="formLabelWidth">
				    <el-radio-group v-model="ruleForm.publicBeta">
				      <el-radio label="是"></el-radio>
				      <el-radio label="否"></el-radio>
				    </el-radio-group>
				  </el-form-item>
				  <el-form-item label="版本说明：" prop="editionState" :label-width="formLabelWidth" :maxlength="DESC_MAX_LENGTH">
					    <el-input type="textarea" v-model="ruleForm.editionState"></el-input>
			  	</el-form-item>
			  	<el-form-item>
				    <el-button style="margin-left:140px;" size="mini" type="primary" @click="submitForm('ruleForm')">提交</el-button>
				  </el-form-item>
				</el-form>
			</div>
		</el-row>
		<div class="tips">
			<div class="tipsContent">
				<p>1.应用命名规范：中文的应用名称开头_其他_信息_apk</p>
				<p>2.所有客户端和服务器端均应遵循该规范否则会导致数据错乱</p>
			</div>
		</div>
	</div>
</template>
<script>
import {getToken, getLocalStorage} from '@/util/storageUtil'
import {changePageSize} from '@/util/numberUtil'
import {verServer} from '@/service/list'
export default {
	data () {
		var checkCompany = (rule, value, callback) => {
			if (!value) {
        return callback(new Error('请至少选择一个公司'))
      } else {
        callback()
      }
		}
		var checkAPK = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('请选择安装包'))
			}

			var checkFile = value.split('.').pop();
			setTimeout(() => {
				if (checkFile != 'apk') {
					return callback(new Error('安装包格式不正确'))
				} else {
					callback()
				}
			}, 1000)
		}
		return {
			ruleForm: {
				APK: '',
				icon: '',
				name: '',  //应用名称
				package: '',  //应用包名
				size: '',
				versionName: '',  //版本名称
				versionNumber: '',
				company: '',
				foceUpgrade: '',
				publicBeta: '',
				editionState: '',
				compCode: '',
				merId: '',
        merName: ''
			},
			compOptions: [],
      selectedOptions: [],
      props: {
        label: 'comp_name',
        value: 'comp_code',
        children: 'enterprises'
      },
			secLevel: '',  //二级提示
			packageAddress: '',  //应用包存放路径
			formLabelWidth: '140px',
			action: '/zqi_appstore/admin/uploadApp.do',
			rules: {
				APK: [{ validator: checkAPK, required: true, trigger: 'blur' }],
				name: [{ required: true, message: '未获取到安装包', trigger: 'blur' }],
				compCode: [{ validator: checkCompany, trigger: 'blur', required: true }]
			},
			fileList: [],
			urlAddress: '',  //路由地址
			dataForm: {
				operateFlag: ''
			},
			appState: '',  //app状态
			fullscreenLoading: false,  //上传加载
			pakSize: '',
			paginationObj: {
				pageSize: 20,
				currentPage: 1,
				totalCount: 0
			},
			beakUp: [],  //备用
			beakId: '',
			fileFormat: '',  //上传文件格式
			loading: false,
			fileLists: [],  //上传APP数量
			disabled: false,  //上传按钮禁用操作
			compCode: ''
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		self.urlAddress = getToken('routeUrl')
		self.appState = getToken('ChangeAppState')
		if (self.appState == 'addNew') {
			self.secLevel = '新增应用'
		} else if (self.appState == 'reUpload') {
			self.secLevel = '上传新版本'
		}
		let data = {"commandId": 0x0515, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "merId": '', "compCode": self.compCode}}
		self.queryCompanyList(data);
	},
	methods: {
		async queryCompanyList (data) {  //公司列表
			let self = this;
			let companyListRes = await verServer(data);
			if (companyListRes.status != 200) {
				self.$message("服务器报错")
				return
			}
			if (companyListRes.status == 200 && companyListRes.data.retCode == 0) {
				let compListData = companyListRes.data.body.merList;
				self.beakUp = compListData;
				compListData.forEach(function (item, index) {
					item.id = item.merId;
					item.comp_name = item.merName;
					item.comp_code = item.compCode;
					self.compOptions.push(item)
				})
			}
		},
		compOptionsChange (val) {  //切换企业
			let self = this;
			self.selectedOptions = val
			self.ruleForm.compCode = self.selectedOptions.join(',')
			self.beakUp.forEach(function (item, index) {
				if (item.compCode == val) {
					self.beakId = item.merId
				}
			})
		},
		handleChange (file, fileList) {
			let self = this;
			self.fileLists = fileList;
			if (self.fileLists.length > 1) {
				self.handleExceed()
			}
			self.fileFormat = file.name.split('.').pop();
			self.pakSize = file.size;
			self.ruleForm.size = changePageSize(file.size, 1);
			self.ruleForm.APK = file.name;
    },
    beforeUpload (file, id) {
    },
    handleExceed (file, fileList) {  //超出个数限制1
    	let self = this;
    	self.fileLists.shift()
    },
		selectAPK () {  //选择安装包

		},
		uploadAPK () {  //上传安装包
			let self = this;
			if (self.ruleForm.APK == '') {
				self.$message.warning('没有选择安装包')
				self.fullscreenLoading = false;
			} else if (self.fileFormat != 'apk') {
				self.$message.warning('安装包格式不正确')
			} else {
				self.fullscreenLoading = true;
				self.$refs.upload.submit();
			}
		},
		success (file, response) {  //上传成功
			let self = this;
			self.fullscreenLoading = false;
			if (response) {
				self.disabled = true;
			}
			self.$message.success(response.response.message)
			self.ruleForm.name = response.response.appName;
			self.ruleForm.package = response.response.pkgName;
			self.ruleForm.versionName = response.response.verName;
			self.ruleForm.versionNumber = response.response.verCode;
			self.ruleForm.foceUpgrade = response.response.needUpdate === null ? '否' : '是'
			self.ruleForm.publicBeta = response.response.isBeta === null ? '是' : '否'
			self.ruleForm.icon = response.response.iconUrl;
			self.packageAddress = response.response.pkgAddr;
			self.ruleForm.company = response.response.companyName;
		},
		async submitForm () {  //提交
			let self = this;
			self.$refs.ruleForm.validate(async(valid) => {
				if (valid) {
					try {
						self.loading = true;
						let data = {
						  "commandId": 0x0509,
						  "reqNode": "WEB",
						  "body": {
						  	"appName": self.ruleForm.name,
						  	"iconUrl": self.ruleForm.icon,
								"isBeta": self.ruleForm.publicBeta = self.ruleForm.publicBeta == '否' ? 1 : 0,
								"needUpdate": self.ruleForm.foceUpgrade = self.ruleForm.foceUpgrade == '否' ? 0 : 1,
								"pkgAddr": self.packageAddress,
								"pkgName": self.ruleForm.package,
								"pkgSize": self.pakSize,
								"pubChannel": 0,
								"releaseNotes": self.ruleForm.editionState,  //版本说明
								"type": 0,  //发布包类型：0表示应用；1表示系统固件
								"verCode": self.ruleForm.versionNumber,
								"verName": self.ruleForm.versionName,
								"companyName": self.ruleForm.company,
								"merId": self.beakId,  //公司id
								"compCode": self.ruleForm.compCode
						  }
					  }
					  let uploadApp = await verServer(data)
						if (uploadApp.status !== 200) {
				    	self.$message.error("服务器错误")
				    	return
				    }
						if (uploadApp.status == 200 && uploadApp.data.retCode == 0) {
							if (self.appState == 'addNew') {
								self.$message.success("上传软件成功")
							} else if (self.appState == 'reUpload') {
								self.$message.success("更新版本成功")
							}
							self.$router.push('/applicationList')
						} else {
							self.$message.error(uploadApp.data.errMsg)
						}
					} finally {
						self.loading = false
					}
				}
			})
		},
		back () {
			let self = this;
			self.$router.push('/applicationList')
		}
	}
}
</script>
<style lang="scss" scoped>
	.addApp {
		position:relative;
		.addAppHeader {
			height: 30px;
			margin-bottom:10px;
			span {
				display: inline-block;
				float:left;
			}
			.el-button--info {
				display: inline-block;
				float:right;
			}
		}
		.addAppContent {
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
					.el-form-item__content {
						.el-button--info {
							margin-left:10px;
						}
					}
				}
			}
		}
		.tips {
			position: absolute;
	    top: 21%;
	    right: 3%;
	    background-color: #fffafa;
	    width: 300px;
	    height: 250px;
	    text-align:left;
	    font-size:10px;
			padding: 20px 16px;
			border-radius:3px;
	    .tipsContent {
				margin-top:25%;
	    }
		}
	}
</style>