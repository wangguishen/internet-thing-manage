<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/companyGather' }">公司列表</el-breadcrumb-item>
					  <template v-if="status == 'add'">
					  	<el-breadcrumb-item class="g-nav-list">新增</el-breadcrumb-item>
					  </template>
					  <template v-else>
					  	<el-breadcrumb-item :to="{ path: '/companyDetails' }">详情</el-breadcrumb-item>
					  	<el-breadcrumb-item class="g-nav-list">修改</el-breadcrumb-item>
					  </template>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-form :model="formCompany" :rules="rules" ref="form" class="g-form-ipt">
				<el-form-item label="所属公司：" :label-width="formLabelWidth" prop="compCode">
					<el-cascader
            :options="compOptions"
            v-model="selectedOptions2"
            @change="compOptionsChange"
            change-on-select
            filterable
            clearable
            :props="props"
            style="width: 50%"
            placeholder="请选择公司企业"
            :disabled="disabled">
          </el-cascader>
				</el-form-item>
				<el-form-item label="内部公司编号：" :label-width="formLabelWidth">
					<el-input v-model="formCompany.merId" placeholder="请输入内部公司编号" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="公司简称：" :label-width="formLabelWidth">
					<el-input v-model="formCompany.merName" placeholder="请输入公司简称" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="个性化背景：" :label-width="formLabelWidth">
					<el-upload
					  class="avatar-uploader"
					  :action="uploadImg1"
					  name="imgFile"
					  :show-file-list="false"
					  :on-change="handleAvatarPreview"
					  list-type="picture"
					  accept=".jpg,.jpeg,.png">
					  <img v-if="formCompany.merViewBg" :src="formCompany.merViewBg" class="avatar" onerror="onerror=null;this.src='/static/image/company1.png'">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth">
					<el-button type="primary" size="mini" @click="sureRegister">保存</el-button>
				</el-form-item>
	  	</el-form>
	  	<el-dialog
			  title="剪切"
			  :visible.sync="dialogCropperVisible"
			  @close="closeClick"
			  >
			  <my-cropper :options="options" @sureClick="sureClick"></my-cropper>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {getRandomString} from '@/util/stringUtil'
import {getToken, getLocalStorage} from '@/util/storageUtil'
import {recursionDelete} from '@/util/arrayUtil'
import {verServer, companyList, uploadImg} from '@/service/list'
import MyCropper from '@/components/my-cropper'
export default {
	components: {
		MyCropper
	},
	data () {
		var checkCompCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请至少选择一个公司'))
      } else {
        callback()
      }
    }
		return {
			loading: false,
			status: '',
			addShow: false,
			companyObj: {
				pathWay: ''
			},
			disabled: false,
			uploadImg1: '/zqi_appstore/admin/uploadImg.do',
			formCompany: {
				merId: '',
				merName: '',
				merViewBg: '',
				compCode: ''
			},
			formLabelWidth: '120px',
			imageUrl: '',
			login: {
				loginName: '123456',
				loginPwd: '123456'
			},
			axiosStatus: '0',
			// 选取接口
			compOptions: [],
			selectedOptions2: [],
			props: {
        label: 'comp_name',
        value: 'comp_code',
        children: 'enterprises'
      },
      selectObjCompany: {
      	comp_code: '',
      	comp_name: ''
      },
      rules: {
        compCode: [
          { validator: checkCompCode, trigger: 'blur', required: true }
        ]
      },
      compCode: '',
      // 剪切
      dialogCropperVisible: false,
      options: {
        img: '',
        size: 1,
        full: false, //输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 320,
        autoCropHeight: 180,
        fixedBox: true
      },
      blob: ''
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		self.status = getToken("companyStatusCode")
		if (self.status == 'add') {
			self.addShow = true;
			self.companyObj.pathWay = '/companyGather'
		} else if (self.status == 'amend') {
			self.addShow = false;
			self.companyObj.pathWay = '/companyDetails'
			self.formCompany = getToken("atPresentCompanyDetails", "json")
			self.imageUrl = self.formCompany.merViewBg
			self.disabled = true;
			if (self.formCompany.compCode) {
	  		self.formCompany.compCode = self.formCompany.compCode.split(',')
	  		self.selectedOptions2 = self.formCompany.compCode
	  	}
		}
		let data = {compCode: self.compCode, type: "0"};
		self.companyLists(data, 'a')
	},
	methods: {
		async companyLists (data, type) {
			let self = this;
			let companyData = await companyList(data)
			if (companyData.status !== 200) {
				self.$message.error("服务器错误")
				return
			}
			if (companyData.status === 200 && companyData.data.success) {
				let list = companyData.data.data;
				if (type == 'a') {
					self.compOptions = recursionDelete(list)
				} else if (type == 'b') {
					self.formCompany.merId = list[0].id;
					self.formCompany.merName = list[0].comp_name;
					self.formCompany.compCode = list[0].comp_code;
				}
			} else {
        self.$message.error(companyData.data.msg)
			}
		},
		async company (data) {
			let self = this;
			let companyData = await verServer(data)
			if (companyData.status !== 200) {
				self.$message.error("服务器错误")
				return
			}
			if (companyData.status == 200 && companyData.data.retCode == 0) {
				if (self.status == 'add') {  //新增请求提交
					self.$message({
	          message: '新增公司成功',
	          type: 'success',
	          duration: 1500,
	          center: true
	        });
	        self.$router.push('/companyGather')
				} else if (self.status == 'amend') {  //更改请求提交
					self.$message({
	          message: '修改公司成功',
	          type: 'success',
	          duration: 1500,
	          center: true
	        });
	        self.$router.push('/companyGather')
				}
			} else {
				if (self.status == 'add') {  //新增请求提交
					self.$message.error(companyData.data.errMsg + '，请重新选择')
				} else if (self.status == 'amend') {
					self.$message.error(companyData.data.errMsg)
				}
			}
		},
		back () {  //返回公司列表页面
			let self = this;
			self.$router.push(self.companyObj.pathWay)
		},
		handleAvatarPreview (file) { //选取文件
			let self = this;
			self.formCompany.merViewBg = file.url
			self.options.img = file.url
			self.dialogCropperVisible = true
		},
		async sureClick (data, base) {
			let self = this
			self.formCompany.merViewBg = base
			self.blob = data
			var formdata = new FormData();
      formdata.append("imgFile", self.blob, getRandomString(16) + '.jpg');
      let upload = await uploadImg(formdata)
      if (upload.status !== 200) {
				self.$message.error("服务器错误")
				return
			}
			if (upload.status == 200) {
				self.formCompany.merViewBg = upload.data.imgUrl;
				self.imageUrl = upload.data.imgUrl;
      	self.$message.success('上传背景成功')
      	self.dialogCropperVisible = false;
			} else {
				self.$message.error('上传背景失败')
				self.formCompany.merViewBg = ''
			}
		},
		closeClick () {
			let self = this;
			self.formCompany.merViewBg = self.imageUrl;
		},
    sureRegister () {  //保存按钮
    	let self = this;
    	let data = {};
    	self.axiosStatus = '0'
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
          	self.loading = true
            if (self.status == 'add') {
			    		if (self.formCompany.merId == '') {
			    			self.$message({
				          message: '请选择公司企业',
				          type: 'warning',
				          duration: 1500,
				          center: true
				        });
			    		} else {
			    			data = {"commandId": 0x0517, "reqNode": "WEB", "body": {"merId": self.formCompany.merId, "merName": self.formCompany.merName, "merViewBg": self.formCompany.merViewBg, "compCode": self.selectedOptions2.join(',')}}
			    			self.company(data)
			    		}
						} else if (self.status == 'amend') {
							if (self.formCompany.merName == '') {
			    			self.$message({
				          message: '请输入公司简称',
				          type: 'warning',
					          duration: 1500,
					          center: true
				        });
			    		} else {
			    			data = {"commandId": 0x0545, "reqNode": "WEB", "body": {"merId": self.formCompany.merId, "merName": self.formCompany.merName, "merViewBg": self.formCompany.merViewBg}}
			    			self.company(data)
			    		}
						}
          } finally {
            self.loading = false
          }
        }
      })
    },
    compOptionsChange (value) {
      let self = this
      if (self.selectedOptions2.length > 0) {
        self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
      }
    },
    compChange (compValue) {  /*改变企业*/
    	let self = this;
    	let data = {compCode: compValue, type: "0"};
			self.companyLists(data, 'b')
  	}
	}
}
</script>
<style lang="scss" scoped>
	.l-father-div{
		height:100%;
	}
	.g-main{
		text-align: left;
		min-height: 80%;
		background: #fff;
		padding: 15px 0 10px;
		border: 1px solid #e3e9ec;
		border-radius: 3px;
	}
	.ipt_wid{
		width: 50%;
	}
	.s-company-bg-img{
		display: block;
		width: 28%;
		border-radius: 3px;
	}
</style>