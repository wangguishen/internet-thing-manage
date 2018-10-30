<template>
	<div class="operation-server-add">
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationServer'}">服务器环境</el-breadcrumb-item>
				  <el-breadcrumb-item>新增</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationServer')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" :rules="rules" ref="form" class="g-form-ipt tl">
			  	<el-form-item label="公司：" :label-width="formLabelWidth" prop="compCode">
						<el-cascader
	            :options="compOptions"
	            v-model="selectedOptions"
	            @change="compOptionsChange"
	            change-on-select
	            filterable
	            clearable
	            :props="props"
	            style="width: 60%"
	            placeholder="请选择公司">
	          </el-cascader>
					</el-form-item>
			    <el-form-item label="目的主机IP:" :label-width="formLabelWidth" prop="ip">
			      <el-input v-model="form.ip" class="g-item-ipt" @blur="checkBlurIP"></el-input>
			    </el-form-item>
			    <el-form-item label="端口:" :label-width="formLabelWidth" prop="port">
			      <el-input v-model="form.port" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:" :label-width="formLabelWidth">
			      <el-input v-model="form.name" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="密码/公钥:" :label-width="formLabelWidth" prop="pubkey">
			      <el-input v-model="form.pubkey" class="g-item-ipt" maxlength="20"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="sublimt('form')" :disabled="disabled">提交</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>
<script>
import {addServerInfo, checkIPExist} from '@/service/iot-frame'
import {companyList} from '@/service/list'
import {recursionDelete} from '@/util/arrayUtil'
import {getLocalStore, getLocalStorage} from '@/util/storageUtil'
import {checkStr} from '@/util/typeUtil'
export default {
	data () {
		var checkCompCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择公司'))
        } else {
          callback()
        }
      }
    var checkIP = (rule, value, callback) => {
    	if (!value) {
    		return callback(new Error('IP不能为空'))
    	}
    	setTimeout(() => {
      	if (!checkStr(value, 'IP')) {
      		return callback(new Error('IP格式不正确'))
      	} else {
	    		callback()
	    	}
      }, 1000)
    }
		return {
			loading: false,
			dialogFormVisible: true,
      form: {
      	ip: '', //目的主机IP
      	port: '', //端口
        name: '', //用户名
        pubkey: '', //密码/公钥
        company: '', //公司
        address: '', //地址
        useIp: '', //使用ip
        owner: '', //所属人
        useObject: '', // 使用对象
        useNum: '', //使用次数
        state: '',
        compCode: '',
        merId: '',
        merName: ''
      },
      check_ip: '',
      formLabelWidth: '100px',
      compOptions: [],
      selectedOptions: [],
      props: {
        label: 'comp_name',
        value: 'comp_code',
        children: 'enterprises'
      },
      adminInfo: {},
      rules: {
      	comp_code: [{type: 'array', required: true, message: '请至少选择一个公司', trigger: 'change'}],
      	compCode: [{validator: checkCompCode, trigger: 'blur', required: true}],
      	ip: [{validator: checkIP, trigger: 'blur', required: true}],
      	port: [{required: true, message: '请输入端口', trigger: 'blur'}],
      	pubkey: [{required: true, message: '请输入密码/公钥', trigger: 'blur'}]
      },
      disabled: false, //提交按钮
      compCode: ''
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		self.adminInfo = getLocalStore('USER_INFO', 'json');
		self.form.name = self.adminInfo.userName | self.adminInfo.account;
		let data = {compCode: self.compCode, type: "0"};
		self.companyLists(data, 'a')
	},
	methods: {
		async checkBlurIP () {
			let self = this;
			let ipData = {
				ip: self.form.ip
			}
			let checkIPResData = await checkIPExist(ipData)
			if (checkIPResData.data.data) {
				self.$message.warning('该IP已存在')
				self.disabled = true;
			} else {
				self.disabled = false;
			}
		},
		compOptionsChange (val) { //切换企业
			let self = this;
			if (self.selectedOptions.length > 0) {
        self.compChange(self.selectedOptions[self.selectedOptions.length - 1])
      }
		},
		compChange (compValue) {
			let self = this;
			self.form.compCode = compValue
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
		back () { //返回server列表页
			let self = this;
			self.$router.push('/operationServer');
		},
		async sublimt (form) { //提交
			let self = this;
			self.$refs.form.validate(async (valid) => {
        if (valid) {
      		try {
            self.loading = true
            let data = {
							'id': null,
							'ip': self.form.ip,
							'userName': self.form.name,
							'password': self.form.pubkey,
							'port': self.form.port,
							'owner': self.form.owner,
							"state": self.form.state, //状态
							"compCode": self.form.comp_code,
							"remarks": "", //备注
							"catalog": '', //目录
			    		"createTime": '',
			    		"updateTime": ''
						}
						let addResData = await addServerInfo(data);
						if (addResData.status == 200 && addResData.data.message == 'success') {
							self.$message.success('新增成功')
							self.$router.push('/operationServer')
						} else {
							self.$message.error(addResData.data.message)
						}
					} finally {
            self.loading = false
          }
        }
      })
		}
	}
}
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
			margin-left: 100px;
		}
	}
</style>