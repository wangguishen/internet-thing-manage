<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/facilityList' }">终端设备</el-breadcrumb-item>
					  <el-breadcrumb-item class="g-nav-list">新增</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn s-four-text-btn" size="mini" type="primary" @click="facilityList()">批量录入</el-button>
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-form :model="formCompany" class="g-form-ipt" :rules="rules" ref="form">
				<el-form-item label="所属公司：" :label-width="formLabelWidth" prop="merId">
					<el-cascader
            :options="compOptions"
            v-model="selectedOptions2"
            @change="compOptionsChange"
            change-on-select
            filterable
            clearable
            :props="props"
            style="width: 50%"
            placeholder="请选择公司企业">
          </el-cascader>
				</el-form-item>
				<el-form-item label="设备序列号：" :label-width="formLabelWidth" prop="sn">
					<el-input v-model="formCompany.sn" auto-complete="off" class="ipt_wid g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth">
					<el-button class="g-top-btn" size="mini" type="primary" @click="facititySub">提交</el-button>
				</el-form-item>
	  	</el-form>
		</div>
	</div>
</template>
<script>
import {setToken, getLocalStorage} from '@/util/storageUtil'
import {verServer} from '@/service/list'
export default {
	data () {
		var checkCompCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择所属公司'))
      } else {
        callback()
      }
    }
		return {
			loading: false,
			formCompany: {
				sn: '',
				merId: ''
			},
			formLabelWidth: '120px',
			// 公司
			compOptions: [],
			selectedOptions2: [],
			props: {
        label: 'merName',
        value: 'merId'
      },
      rules: {
        sn: [
          {required: true, message: '请输入设备序列号', trigger: 'blur'}
        ],
        merId: [
          {validator: checkCompCode, trigger: 'blur', required: true}
        ]
      },
      compCode: ''
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		let data = {
			"commandId": 0x0515,
			"reqNode": "WEB",
			"body": {
				"merId": self.formCompany.merId,
				"compCode": self.compCode,
				"pageSize": 10000
			}
		}
		self.company(data, 'a')
	},
	methods: {
		async company (data, type) {
			let self = this;
			let companyData = await verServer(data)
			if (companyData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (companyData.status == 200 && companyData.data.retCode == 0) {
				if (type == 'a') {
					let list = companyData.data.body.merList
	        self.compOptions = list
				} else if (type == 'b') {
					self.$message({
	          message: '添加设备成功',
	          type: 'success',
	          duration: 1500,
	          center: true
	        });
	        self.$router.push('/facilityList')
				}
			} else {
				self.$message.error(companyData.data.errMsg)
			}
		},
		back () { //返回设备列表页面
			let self = this;
			self.$router.push('/facilityList')
		},
		amend () { //修改页面
			let self = this;
			setToken("companyStatusCode", 'amend')
			self.$router.push('/companyAdd')
		},
		facilityList () { //批量录入
			let self = this;
			self.$router.push('/facilityBatchenter')
		},
		recursionDelete (list) { //递归删除enterprises为空的属性
      let self = this
      list.forEach(function (item, index) {
        if (item.enterprises.length === 0) {
          delete item.enterprises
        } else {
          self.recursionDelete(item.enterprises)
        }
      })
    },
    compOptionsChange (value) {
      let self = this
      if (self.selectedOptions2.length > 0) {
        self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
      } else {
      	self.formCompany.merId = ''
      }
    },
    compChange (compValue) { //改变企业
    	let self = this;
    	self.formCompany.merId = compValue
  	},
  	facititySub () { //提交
  		let self = this;
  		self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            self.loading = true
            let data = {
            	"commandId": 0x0535,
            	"reqNode": "WEB",
            	"body": {
            		"sn": self.formCompany.sn,
            		"merId": self.formCompany.merId
            	}
            }
  					self.company(data, 'b')
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
	.g-form-ipt .el-form-item{
		margin-bottom: 25px;
	}

</style>