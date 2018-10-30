<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/accreditLab' }">实验室授权</el-breadcrumb-item>
				  	<el-breadcrumb-item class="g-nav-list">新增</el-breadcrumb-item>
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
			<el-form :model="labList" :rules="rules" ref="form" class="g-form-ipt">
				<el-form-item label="实验室名称：" :label-width="formLabelWidth" prop="typeName">
					<el-input v-model="labList.typeName" :maxlength="NAME_MAX_LENGTH" placeholder="请输入实验室名称" auto-complete="off" class="ipt_wid g-item-ipt" clearable></el-input>
				</el-form-item>
				<el-form-item label="所属企业：" :label-width="formLabelWidth" prop="labList">
					<el-select v-model="labList.company" multiple filterable placeholder="请选择所属企业" size="small">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth">
					<el-button type="primary" size="mini" @click="sureRegister">保存</el-button>
				</el-form-item>
	  	</el-form>
		</div>
	</div>
</template>
<script>
import {addLaboratory} from '@/service/iot-frame'
import {verServer} from '@/service/list'
export default {
	data () {
		return {
			loading: false,
			labList: {
				typeName: '',
				company: []
			},
			formLabelWidth: '120px',
      rules: {
        typeName: [
          {required: true, message: '请输入实验室名称', trigger: 'blur'}
        ]
      },
      compCode: '',
      options: [],
      value5: []
		}
	},
	mounted () {
		let self = this;
		self.companySingle()
	},
	methods: {
		async companySingle () {
			let self = this;
			let GetDeviceListReqData = {
        "commandId": 0x0515,
        "reqNode": "WEB",
        "body": {
          "pageSize": 10000,
          "pageIndex": 1,
          "compCode": self.compCode
        }
      }
      let resData = await verServer(GetDeviceListReqData)
      if (resData.status !== 200) {
        self.$message.error('服务器错误')
        self.loading = false
        return
      }
      if (resData.data.retCode !== 0) {
        self.$message.error(resData.data.errMsg)
        self.loading = false
        return
      }
      let list = resData.data.body.merList
      console.log(list)
      list.forEach((item, index) => {
      	let data = {
      		value: item.compCode,
      		label: item.merName
      	}
        self.options.push(data)
      })
		},
		async company (data) { //公共方法请求 -- 新增
			let self = this;
			let companyData = await addLaboratory(data)
			if (companyData.status !== 200) {
				self.$message.error("服务器错误")
				return
			}
				console.log(companyData)
			if (companyData.status == 200 && companyData.data.message == 'success') {
				self.$message.success('新增实验室成功')
        self.$router.push('/accreditLab')
			} else {
				self.$message.error(companyData.data.message)
			}
		},
		back () { //返回实验室授权列表页面
			let self = this;
			self.$router.push('/accreditLab')
		},
    sureRegister () { //保存按钮--新增操作
    	let self = this;
    	let data = {};
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
          	self.loading = true
	    			data = {
	    				"labName": self.labList.typeName,
	    				"compCodeList": self.labList.company
	    			}
	    			console.log(data)
	    			self.company(data)
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
</style>