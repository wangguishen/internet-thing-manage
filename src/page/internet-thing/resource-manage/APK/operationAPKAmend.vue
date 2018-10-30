<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationAPK'}">安装包</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/operationAPKDetail'}">详情</el-breadcrumb-item>
				  <el-breadcrumb-item>修改</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationAPKDetail')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl" :rules="rules" ref="form">
			  	<el-form-item label="公司名称:" :label-width="formLabelWidth">
			      <el-cascader
					    :options="compOptions"
					    v-model="selectedOptions"
            	change-on-select
	            filterable
	            clearable
	            :props="props"
	            placeholder="请选择公司企业"
	            disabled>
					  </el-cascader>
			    </el-form-item>
			    <el-form-item label="名称:" prop="fileName" :label-width="formLabelWidth">
			      <el-input v-model="form.fileName" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-form-item label="版本:" :label-width="formLabelWidth">
			      <el-input v-model="form.fileVersion" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="存储路径:" :label-width="formLabelWidth">
			      <el-input v-model="form.pagePath" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="状态:" :label-width="formLabelWidth">
			      <el-input v-model="form.status || '正常'" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="大小:" :label-width="formLabelWidth">
			      <el-input v-model="form.size" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:" :label-width="formLabelWidth">
			      <el-input v-model="form.userName" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="描述:" :label-width="formLabelWidth">
			      <el-input type="textarea" v-model="form.fileDesc" class="g-item-ipt" :maxlength="DESC_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="apkAmendSubmitBtn">
            提交
          </el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
import {companyList} from '@/service/list'
import {recursionDelete} from '@/util/arrayUtil'
import {amendAPKInfo} from '@/service/iot-frame'
import {changePageSize} from '@/util/numberUtil'
import {getToken, setToken, getLocalStore} from '@/util/storageUtil'
export default {
  data () {
    return {
    	loading: false,
    	userInfo: {},
			compOptions: [],
			selectedOptions: [],
			props: {
        label: 'comp_name',
        value: 'comp_code',
        children: 'enterprises'
      },
      form: {
      	id: '',
      	fileName: '',
      	fileDesc: '',
      	fileVersion: '',
      	pagePath: '',
      	status: '',
      	pageSize: '',
      	userName: '',
      	userId: '',
      	comp_code: '',
      	size: ''
      },
      fileList: [],
      formLabelWidth: '100px',
      rules: {
        fileName: [
          {required: true, message: '请输入安装包名称', trigger: 'blur'}
        ]
      }
    };
  },
  mounted () {
  	let self = this;
  	let detail = getToken("atPresentAPKDetails", "json")
  	self.userInfo = getLocalStore("USER_INFO", "json")
  	self.account = self.userInfo.userName | self.userInfo.account
  	if (detail.compCode) {
  		detail.compCode = detail.compCode.split(',')
  		self.selectedOptions = detail.compCode
  	}
  	detail.size = changePageSize(detail.pageSize, 1);
  	self.form = detail;
  	let data = {compCode: '', type: "0"};
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
		async amendApkSub (data) {
			let self = this;
			let apkSubmit = await amendAPKInfo(data)
			if (apkSubmit.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (apkSubmit.status == 200 && apkSubmit.data.status == '200') {
				self.$message({
          message: '修改安装包成功',
          type: 'success',
          duration: 1500,
          center: true
        });
        self.form.compCode = self.form.compCode.join(',')
				setToken('atPresentAPKDetails', self.form)
        self.$router.push('/operationAPKDetail')
			} else {
				self.$message.error(apkSubmit.data.message)
			}
		},
    apkAmendSubmitBtn () { //修改
    	let self = this;
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            self.loading = true
            let data = {
		    			id: self.form.id,
		    			fileName: self.form.fileName, //安装包名称
              pagePath: self.form.pagePath, //安装包路径
              pageSize: self.form.pageSize, //安装包大小
              userName: self.form.userName, //创建人
              fileDesc: self.form.fileDesc, //文件描述
              compCode: self.form.compCode.join(','), //公司编码
              applicant: self.account, //当前用户名
              fileVersion: '1.0',
              extension: self.form.extension
		    		}
		    		self.amendApkSub(data)
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
</style>

