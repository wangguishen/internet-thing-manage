<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/classList' }">算法范围</el-breadcrumb-item>
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
			<el-form :model="airthClassList" :rules="rules" ref="form" class="g-form-ipt">
				<el-form-item label="算法类型：" :label-width="formLabelWidth" prop="typeName">
					<el-input v-model="airthClassList.typeName" :maxlength="NAME_MAX_LENGTH" placeholder="请输入算法类型" auto-complete="off" class="ipt_wid g-item-ipt"></el-input>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth">
					<el-button type="primary" size="mini" @click="sureRegister">保存</el-button>
				</el-form-item>
	  	</el-form>
		</div>
	</div>
</template>
<script>
import {addAlgorithmType} from '@/service/iot-frame'
export default {
	data () {
		return {
			loading: false,
			airthClassList: {
				typeName: ''
			},
			formLabelWidth: '120px',
      rules: {
        typeName: [
          {required: true, message: '请输入算法类型', trigger: 'blur'}
        ]
      },
      compCode: ''
		}
	},
	methods: {
		async company (data) { //公共方法请求 -- 新增
			let self = this;
			let companyData = await addAlgorithmType(data)
			if (companyData.status !== 200) {
				self.$message.error("服务器错误")
				return
			}
			if (companyData.status == 200 && companyData.data.message == 'success') {
				self.$message.success('新增算法成功')
        self.$router.push('/classList')
			} else {
				self.$message.error('新增算法失败')
			}
		},
		back () { //返回算法范围列表页面
			let self = this;
			self.$router.push('/classList')
		},
    sureRegister () { //保存按钮--新增操作
    	let self = this;
    	let data = {};
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
          	self.loading = true
	    			data = {
	    				"typeName": self.airthClassList.typeName,
	    				"status": "0"
	    			}
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