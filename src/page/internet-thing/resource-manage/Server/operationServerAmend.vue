<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationServer'}">服务器环境</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/operationServerDetail'}">详情</el-breadcrumb-item>
				  <el-breadcrumb-item>修改</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationServerDetail')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl" :rules="rules" ref="form">
			  	<el-form-item label="公司：" :label-width="formLabelWidth">
						<el-cascader
	            :options="compOptions"
	            v-model="selectedOptions"
	            @change="compOptionsChange"
	            change-on-select
	            filterable
	            clearable
	            :props="props"
	            style="width: 60%"
	            placeholder="请选择公司"
	            disabled>
	          </el-cascader>
					</el-form-item>
			    <el-form-item label="目的主机IP:" :label-width="formLabelWidth" prop="ip">
			      <el-input v-model="form.ip" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="端口:" :label-width="formLabelWidth" prop="port">
			      <el-input v-model="form.port" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:" :label-width="formLabelWidth">
			      <el-input v-model="form.name" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="密码/公钥:" :label-width="formLabelWidth" prop="pubKey">
			      <el-input v-model="form.pubKey" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="submitAmend">提交</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
import {getToken, setToken} from '@/util/storageUtil'
import {updateServerInfo} from '@/service/iot-frame'
import {recursionDelete} from '@/util/arrayUtil'
import {companyList} from '@/service/list'
  export default {
    data () {
      return {
        form: {
        	ip: '',
        	port: '',
        	name: '',
        	pubKey: '',
        	state: '',
        	address: '',
        	owner: ''
        },
        formLabelWidth: '100px',
        singRowData: {},
        compOptions: [],
        selectedOptions: [],
        props: {
        	label: 'comp_name',
        	value: 'comp_code',
        	children: 'enterprises'
        },
        rules: {
	      	ip: [{required: true, message: '请输入目的主机IP', trigger: 'blur'}],
	      	port: [{required: true, message: '请输入端口', trigger: 'blur'}],
	      	pubKey: [{required: true, message: '请输入密码/公钥', trigger: 'blur'}]
	      }
      }
    },
    mounted () {
    	let self = this;
    	self.singRowData = getToken('operaServerSingData', 'json')
    	self.form.ip = self.singRowData.ip;
    	self.form.port = self.singRowData.port;
    	self.form.name = self.singRowData.userName;
    	self.form.pubKey = self.singRowData.password;
    	self.form.address = self.singRowData.catalog;
    	self.form.owner = self.singRowData.owner;
    	if (self.singRowData.compCode) {
				self.selectedOptions = self.singRowData.compCode.split(',') //转为数组
			}
			let data = {compCode: '', type: "0"};
			self.companyLists(data, 'a')
    },
    methods: {
    	compOptionsChange (val) { //切换企业
				let self = this;
				if (self.selectedOptions.length > 0) {
	        self.compChange(self.selectedOptions[self.selectedOptions.length - 1])
	      }
			},
			compChange (compValue) {
				let self = this;
				let data = {compCode: compValue, type: "0"};
				self.companyLists(data, 'b')
			},
			async companyLists (data, type) {
				let self = this;
				let companyData = await companyList(data)
				if (companyData.status == 200 && companyData.data.success) {
					let list = companyData.data.data;
					if (type == 'a') {
						self.compOptions = recursionDelete(list)
					} else if (type == 'b') {
						self.form.comp_code = self.selectedOptions.join(',')
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
      async submitAmend () { //提交修改
      	let self = this;
      	self.$refs.form.validate(async (valid) => {
	        if (valid) {
	          try {
	            self.loading = true
	            let data = {
			      		'id': self.singRowData.id,
			      		"ip": self.form.ip,
						    "userName": self.form.name,
						    "password": self.form.pubKey,
						    "remarks": "",
								"owner": self.form.owner,
								"state": self.form.state,
								"catalog": self.form.catalog,
								"port": self.form.port,
						    "createTime": null,
						    "updateTime": null,
						    "compCode": self.singRowData.compCode
			      	}
			      	let submitAmendRes = await updateServerInfo(data)
			      	if (submitAmendRes.status == 200 && submitAmendRes.data.message == 'success') {
			      		self.$message.success('修改成功');
			      		setToken('operaServerSingData', submitAmendRes.data.data)
			      		self.$router.push('/operationServerDetail')
			      	} else {
			      		self.$message.error(submitAmendRes.data.message)
			      	}
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
		margin-left: 100px;
	}
</style>

