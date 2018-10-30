<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/companyGather' }">公司应用</el-breadcrumb-item>
					  <el-breadcrumb-item>详情</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn s-four-text-btn" size="mini" type="primary" @click="facilityList()">设备列表</el-button>
			  		<el-button class="g-top-btn" size="mini" type="primary" @click="amend()">修改</el-button>
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-form :model="formCompany" ref="formAccount" class="g-form-ipt">
				<el-form-item class="g-item-ipt" label="内部公司号：" :label-width="formLabelWidth">
					<el-input v-model="formCompany.merId" auto-complete="off" class="ipt_wid" disabled></el-input>
				</el-form-item>
				<el-form-item class="g-item-ipt" label="公司简称：" :label-width="formLabelWidth">
					<el-input v-model="formCompany.merName" auto-complete="off" class="ipt_wid" disabled></el-input>
				</el-form-item>
				<el-form-item label="个性化背景：" :label-width="formLabelWidth">
					<template v-if="formCompany.merViewBg">
						<img class="s-company-bg-img" :src="formCompany.merViewBg" alt="图片加载失败" onerror="onerror=null;this.src='/static/image/company1.png'">
					</template>
					<template v-else>
						<img class="s-company-bg-img" src="static/image/company1.png" alt="图片加载失败">
					</template>
				</el-form-item>
	  	</el-form>
		</div>
	</div>
</template>
<script>
import {getToken, setToken} from '@/util/storageUtil'
export default {
	data () {
		return {
			formCompany: {
				merId: '',
				merName: '',
				merViewBg: ''
			},
			formLabelWidth: '120px'
		}
	},
	mounted () {
		let self = this;
		let companyDetails = getToken("atPresentCompanyDetails", "json")
		self.formCompany = companyDetails
	},
	methods: {
		back () {  //返回公司列表页面
			let self = this;
			self.$router.push('/companyGather')
		},
		amend () {  //修改页面
			let self = this;
			setToken("companyStatusCode", 'amend')
			self.$router.push('/companyAdd')
		},
		facilityList () {  //设备列表
			let self = this;
			self.$router.push('/companyFacility')
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