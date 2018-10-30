<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationAPK'}">安装包</el-breadcrumb-item>
				  <el-breadcrumb-item>新增</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationAPK')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl" :rules="rules" ref="form">
			    <el-form-item label="公司名称:" :label-width="formLabelWidth" prop="compCode">
			      <el-cascader
					    :options="compOptions"
					    v-model="selectedOptions"
            	@change="compOptionsChange"
            	change-on-select
	            filterable
	            clearable
	            :props="props"
	            placeholder="请选择公司企业">
					  </el-cascader>
			    </el-form-item>
			    <el-form-item label="名称:" :label-width="formLabelWidth" prop="fileName" :maxlength="NAME_MAX_LENGTH">
			      <el-input v-model="form.fileName" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="路径:" :label-width="formLabelWidth" prop="pagePath">
			      <el-input v-model="form.pagePath" class="g-item-ipt" disabled></el-input>
			      <el-upload
					    class="upload-demo inline-block"
					    action="/iot-frame/file_upload"
					    :on-success="hendleSuccess"
					    :on-preview="handlePreview"
					    :on-error="handleError"
					    :on-remove="handleRemove"
					    :auto-upload="true"
					    :show-file-list="false">
					    <el-button class="s-select-btn g-top-btn" slot="trigger" size="mini" type="primary">选择</el-button>
					  </el-upload>
			    </el-form-item>
			    <el-form-item label="大小:" :label-width="formLabelWidth">
			      <el-input v-model="form.size" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:" :label-width="formLabelWidth">
			      <el-input v-model="form.userName" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="描述:" :label-width="formLabelWidth">
			      <el-input type="textarea" v-model="form.fileDesc" class="g-item-ipt" :maxlength="DESC_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="apkSubmitBtn">提交</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
import {companyList} from '@/service/list'
import {addAPKInfo} from '@/service/iot-frame'
import {recursionDelete} from '@/util/arrayUtil'
import {changePageSize} from '@/util/numberUtil'
import {getLocalStorage} from '@/util/storageUtil'
export default {
  data () {
    var checkStoragePath = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择一个安装包进行上传'))
      } else {
        callback()
      }
    }
    var checkCompCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请至少选择一个公司'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      userInfo: {},
      account: '',
      compOptions: [],
			selectedOptions: [],
			props: {
        label: 'comp_name',
        value: 'comp_code',
        children: 'enterprises'
      },
      form: {
      	fileName: '',
      	fileDesc: '',
      	fileVersion: '',
      	pagePath: '',
      	status: '',
      	pageSize: '',
        size: '',
      	userName: '',
      	compCode: '',
      	merId: '',
      	merName: '',
        extension: ''
      },
      fileList: [],
      formLabelWidth: '100px',
      compCode: '',
      rules: {
        fileName: [
          {required: true, message: '请输入安装包名称', trigger: 'blur'}
        ],
        pagePath: [
          {validator: checkStoragePath, trigger: 'blur', required: true}
        ],
        compCode: [
          {validator: checkCompCode, trigger: 'blur', required: true}
        ]
      }
    };
  },
  mounted () {
  	let self = this;
    self.userInfo = getLocalStorage("USER_INFO", "json")
    self.compCode = self.userInfo.compCode || ''
    self.account = self.userInfo.userName | self.userInfo.account
    self.form.userName = self.account;
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
			if (companyData.status == 200 && companyData.data.success) {
				let list = companyData.data.data;
				if (type == 'a') {
					self.compOptions = recursionDelete(list)
				} else if (type == 'b') {
					self.form.compCode = self.selectedOptions.join(',')
					self.form.merId = list[0].id;
					self.form.merName = list[0].comp_name;
				}
			} else {
				self.$message({
          message: companyData.data.msg,
          type: 'error',
          duration: 1500,
          center: true
        });
			}
		},
		async apkSubmit (data) {
			let self = this;
			let apkSubmit = await addAPKInfo(data)
      if (apkSubmit.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (apkSubmit.status == 200 && apkSubmit.data.status == '200') {
				self.$message({
          message: '新增安装包成功',
          type: 'success',
          duration: 1500,
          center: true
        });
        self.$router.push('/operationAPK')
			} else {
				self.$message.error(apkSubmit.data.message)
			}
		},
		compOptionsChange (value) {
      let self = this
      if (self.selectedOptions.length > 0) {
        self.compChange(self.selectedOptions[self.selectedOptions.length - 1])
      }
    },
    compChange (compValue) { /*改变企业*/
    	let self = this;
    	let data = {compCode: compValue, type: "0"};
			self.companyLists(data, 'b')
  	},
  	hendleSuccess (response, file, fileList) { //上传成功时的钩子
    	let self = this
    	self.form.pagePath = response.data
      self.form.size = changePageSize(file.size, 1);
    	self.form.pageSize = file.size;
      let arr = response.data.split('.')
      self.form.extension = arr[arr.length - 1]
      self.$message.success('上传成功')
    },
    handleError (response, file, fileList) { //上传失败时的钩子
    	let self = this
    	self.$message.error("上传失败", response)
    },
    handleRemove (file, fileList) { //文件列表移除文件时的钩子
    },
    handlePreview (file) { //点击已上传的钩子
    },
    apkSubmitBtn () { //提交
    	let self = this;
      self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            self.loading = true
            let data = {
              fileName: self.form.fileName, //安装包名称
              pagePath: self.form.pagePath, //安装包路径
              pageSize: self.form.pageSize, //安装包大小
              userName: self.form.userName, //创建人
              fileDesc: self.form.fileDesc, //文件描述
              compCode: self.form.compCode, //公司编码
              applicant: self.account, //当前用户名
              fileVersion: '1.0',
              extension: self.form.extension
            }
            self.apkSubmit(data)
          } finally {
            self.loading = false
          }
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
	.g-content {
    border: 1px solid #e3e9ec;
    background: #fff;
    padding: 15px;
    .g-form-ipt {
      margin-bottom: 60px;
    }
		.g-item-ipt {
			width: 60%;
		}
		.upload-demo {
			margin-left: 10px;
		}
		.s-sure-btn {
			margin-left: 80px;
		}
	}
</style>

