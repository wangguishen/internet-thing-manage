<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/applyAudit'}">申请审核</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/applyAudit')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="90px" :model="form" class="g-form-ipt tl">
			    <el-form-item label="申请公司:">
			      <el-input v-model="applyComp" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="算法名称:">
			      <el-input v-model="form.name" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="当前版本:">
			      <el-input v-model="form.version" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="申请时间:">
			      <el-input v-model="applyTime" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <template v-if="activeIndex === '1'">
				    <el-form-item label="退订原因:">
				      <el-input v-model="unsubscribeReason" class="g-item-ipt" disabled="disabled"></el-input>
				    </el-form-item>
			    </template>
			    <el-form-item label="算法提供方:">
			      <el-input v-model="form.creator" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传时间:">
			      <el-input v-model="form.createTime" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="申请次数：">
            <el-input v-model="form.addNum" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
          </el-form-item>
          <el-form-item label="大小:">
            <el-input v-model="form.size" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-input v-model="form.status" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
			    <el-form-item label="描述:" class="g-audit-ta">
			      <el-input type="textarea" v-model="form.descption" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
  import { formatTime } from '@/util/dateUtil'
  import { getToken } from '@/util/storageUtil'
  import { queryAlgorithmInfo } from '@/service/iot-frame'
  export default {
    data () {
      return {
        form: {},
        applyComp: '', //申请公司
        applyTime: '', //申请时间
        applyAuditDetail: '',
        activeIndex: ''
      };
    },
    mounted () {
      let self = this
      self.applyAuditDetail = getToken('APPLY_AUDIT_DETAIL', 'json')
      self.activeIndex = getToken('APPLY_AUDIT_AX')
      self.applyTime = self.applyAuditDetail.createTime !== null ? formatTime(self.applyAuditDetail.createTime, '{y}/{m}/{d} {h}:{i}') : self.applyTime
      self.applyComp = self.applyAuditDetail.compName
      self.queryAlgorithmInfo()
    },
    methods: {
      async queryAlgorithmInfo () { //详情数据
      	let self = this
      	let resData = await queryAlgorithmInfo('?id=' + (self.applyAuditDetail.algorithmId || self.applyAuditDetail.sdkNum) + '&compCode=' + self.applyAuditDetail.compCode)
      	self.form = resData.data.data
      	self.form.createTime = self.form.createTime !== null ? formatTime(self.form.createTime, '{y}/{m}/{d} {h}:{i}') : self.form.createTime
      	self.form.status = self.form.status === '0' ? '正常' : '不正常'
      }
    }
  };
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
</style>

