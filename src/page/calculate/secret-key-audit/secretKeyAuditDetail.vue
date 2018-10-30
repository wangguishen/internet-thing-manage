<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/secretKeyAudit'}">密钥审核</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/secretKeyAudit')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="120px" :model="form" class="g-form-ipt tl">
			    <el-form-item label="公司名称:">
			      <el-input v-model="form.compName" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="有效地址:">
			      <el-input v-model="form.address" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="营业执照号码:">
			      <el-input v-model="form.number" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="公司负责人:">
			      <el-input v-model="form.person" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="公司联系电话:">
			      <el-input v-model="form.phone" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="电子邮箱:">
			      <el-input v-model="form.email" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
          <el-form-item label="营业执照:">
          	<template v-if="form.img">
          		<img class="l-img-sty" preview="0" :src="form.img" alt="" onerror="onerror=null;this.src='/static/image/company1.png'">
          	</template>
            <template v-else>
            	<img class="l-img-sty" preview="0" src="/static/image/company1.png" alt="">
            </template>
          </el-form-item>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>
<script>
import { formatTime } from '@/util/dateUtil'
import { getToken } from '@/util/storageUtil'
import { queryCompanyInfo } from '@/service/iot-frame'
export default {
	data () {
		return {
			form: {},
			applyComp: '', //申请公司
      applyTime: '', //申请时间
			applyAuditDetail: ''
		}
	},
	mounted () {
    let self = this
    self.applyAuditDetail = getToken('SECRET_KEY_AUDIT_DETAIL', 'json')
    self.applyTime = self.applyAuditDetail.createTime !== null ? formatTime(self.applyAuditDetail.createTime, '{y}/{m}/{d} {h}:{i}') : self.applyTime
    self.applyComp = self.applyAuditDetail.compName
    self.queryCompanyInfo()
    },
	methods: {
		async queryCompanyInfo () { //详情数据
    	let self = this
    	let paramData = {
				id: self.applyAuditDetail.companyInfoId
			}
    	let resData = await queryCompanyInfo(paramData)
    	console.log(resData)
    	self.form = resData.data.data
    	self.form.createTime = self.form.createTime !== null ? formatTime(self.form.createTime, '{y}/{m}/{d} {h}:{i}') : self.form.createTime
    }
	}
}
</script>
<style lang="scss" scoped>
	.g-form-ipt {
    margin-bottom: 60px;
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
  .l-img-sty {
    width: 35%;
    border-radius: 3px;
  }
</style>