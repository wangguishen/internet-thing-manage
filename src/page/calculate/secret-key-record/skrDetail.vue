<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/secretKeyRecord'}">申请记录</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/secretKeyRecord')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="160px" :model="form" class="g-form-ipt tl">
			    <el-form-item label="公司名称:" class="g-form-first">
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
			    <template v-if="form.status === '0'">
				    <el-form-item label="拒绝原因:">
				      <el-input v-model="form.refuseReason" class="g-item-ipt" disabled="disabled"></el-input>
				    </el-form-item>
			    </template>
			    <el-form-item label="公司负责人联系电话:">
			      <el-input v-model="form.phone" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="电子邮箱:">
			      <el-input v-model="form.email" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
          <el-form-item label="营业执照:">
            <template v-if="form.img">
          		<img class="g-img" preview="0" :src="form.img" alt="" onerror="onerror=null;this.src='/static/image/company1.png'">
          	</template>
            <template v-else>
            	<img class="g-img" preview="0" src="/static/image/company1.png" alt="">
            </template>
          </el-form-item>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
  import { getToken } from '@/util/storageUtil'
  export default {
  	data () {
  		return {
  			form: {}
  		}
  	},
  	mounted () {
  		this.form = getToken('SECRET_KEY_RECORD', 'json')
  	}
  }
</script>

<style lang="scss" scoped>
  .g-form-ipt {
    margin-bottom: 60px;
		.g-item-ipt {
			width: 60%;
		}
		.g-form-first {
			margin-top: 10px;
		}
  }
  .g-img {
    width: 255px;
    height:160px;
  }
  
</style>

