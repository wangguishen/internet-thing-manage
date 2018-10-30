<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/auditRecord'}">申请记录</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/auditRecord')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="90px" :model="form" class="g-form-ipt tl">
			    <el-form-item label="申请公司:" class="g-form-first" :label-width="formLabelWidth">
			      <el-input v-model="applyComp" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="算法名称:" :label-width="formLabelWidth">
			      <el-input v-model="form.name" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="当前版本:" :label-width="formLabelWidth">
			      <el-input v-model="form.version" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="申请时间:" :label-width="formLabelWidth">
			      <el-input v-model="applyTime" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
					<template v-if="activeIndex === '1'">
				    <el-form-item label="退订原因:" :label-width="formLabelWidth">
				      <el-input v-model="unsubscribeReason" class="g-item-ipt" disabled="disabled"></el-input>
				    </el-form-item>
					</template>
					<template v-if="status === '0'">
						<el-form-item label="拒绝原因:" :label-width="formLabelWidth">
				      <el-input v-model="refuseReason" class="g-item-ipt" disabled="disabled"></el-input>
				    </el-form-item>
					</template>
					<el-form-item label="申请次数/(次):" :label-width="formLabelWidth">
            <el-input v-model="form.addNum" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
          </el-form-item>
          <el-form-item label="剩余次数/(次):" :label-width="formLabelWidth">
            <el-input v-model="form.surplusNum" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
          </el-form-item>
          <el-form-item label="有效时间/(天):" :label-width="formLabelWidth">
            <el-input v-model="form.surplusDay" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
          </el-form-item>
			    <el-form-item label="算法提供方:" :label-width="formLabelWidth">
			      <el-input v-model="form.creator" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传时间:" :label-width="formLabelWidth">
			      <el-input v-model="form.createTime" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
          <el-form-item label="大小:" :label-width="formLabelWidth">
            <el-input v-model="form.size" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="状态:" :label-width="formLabelWidth">
            <el-input v-model="form.status" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
			    <el-form-item label="描述:" class="g-audit-ta" :label-width="formLabelWidth">
			      <el-input type="textarea" v-model="form.descption" class="g-item-ipt"
			        disabled="disabled"></el-input>
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
        unsubscribeReason: '', //退订原因
        refuseReason: '', //拒绝原因
        status: '',
        applyRecordDetail: '',
        activeIndex: '',
        formLabelWidth: '120px'
      };
    },
    mounted () {
      let self = this
      self.applyRecordDetail = getToken('AUDIT_RECORD_DETAIL', 'json')
      self.activeIndex = getToken('AUDIT_RECORD_AX')
    	self.applyTime = self.applyRecordDetail.createTime !== null ? formatTime(self.applyRecordDetail.createTime, '{y}/{m}/{d} {h}:{i}') : self.applyTime
      self.applyComp = self.applyRecordDetail.compName
      self.unsubscribeReason = self.applyRecordDetail.unsubscribeReason || ''
      self.refuseReason = self.applyRecordDetail.refuseReason || ''
      self.status = self.applyRecordDetail.status || '0'
      console.log(self.applyRecordDetail)
      self.queryAlgorithmInfo()
    },
    methods: {
      async queryAlgorithmInfo () { //详情数据
      	let self = this
      	// let id = self.applyRecordDetail.sdkNum
      	let resData = await queryAlgorithmInfo('?id=' + (self.applyRecordDetail.algorithmId || self.applyRecordDetail.sdkNum) + '&compCode=' + self.applyRecordDetail.compCode)
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
		.g-form-first {
			margin-top: 10px;
		}
  }
</style>

