<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>申请审核</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
  	</el-row>
  	<el-row class="g-content">
  	  <el-col :span="24">
	  	  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item :index="arrayType[0]">申请订购</el-menu-item>
				  <el-menu-item :index="arrayType[1]">退订</el-menu-item>
				  <el-menu-item :index="arrayType[2]">续签申请</el-menu-item>
				</el-menu>
				<!-- 申请订购 -->
				<el-table
		      :data="tableData"
		      class="g-table-check-border"
		      align="left"
		      v-loading="loading">
		      <el-table-column
		      	label="申请公司">
		        <template slot-scope="scope">
			        <span :title="scope.row.compName">{{scope.row.compName}}</span>
	      		</template>
		      </el-table-column>
		      <el-table-column
		      	label="算法名称">
		        <template slot-scope="scope">
			        <span :title="scope.row.algorithmInfoName">{{scope.row.algorithmInfoName}}</span>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="申请时间">
		        <template slot-scope="scope">
			        {{scope.row.createTime | formatTime1}}
	      		</template>
		      </el-table-column>
		      <template v-if="applyAuditShow">
			      <el-table-column
			        label="退订原因">
		      		<template slot-scope="scope">
				        <el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{scope.row.unsubscribeReason}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span class="test">{{scope.row.unsubscribeReason}}</span>
				          </div>
				        </el-popover>
			  		  </template>
			      </el-table-column>
		      </template>
		      <template v-if="!applyAuditShow && !applyOrderShow">
		      	<el-table-column
			        label="申请次数(次)"
			        align="center">
			        <template slot-scope="scope">
				        {{scope.row.addNum}}
		      		</template>
			      </el-table-column>
		      </template>
		      <template v-if="applyOrderShow">
		      	<el-table-column
			        label="续签次数/天数"
			        align="center">
			        <template slot-scope="scope">
				        {{scope.row.addNum || scope.row.addDay}}
				        <template v-if="scope.row.addNum == 0">
				        	天
				        </template>
				        <template v-else>
				        	次
				        </template>
		      		</template>
			      </el-table-column>
		      </template>
		      <el-table-column
		        label="操作"
		        align="left"
		        width="270">
		        <template slot-scope="scope">
			        <el-button class="g-top-btn" slot="trigger" size="mini" type="primary" 
			          @click="jumpDetails(scope.row, arrayType[0])">详情
			        </el-button>
			        <template v-if="scope.row.algoStatus !== '1'">
				        <el-button class="g-top-btn s-no-bg-xq-btn" slot="trigger" size="mini" type="primary" 
				          @click="agree(scope.row)">同意
				        </el-button>
			        </template>
			        <el-button class="g-top-btn s-no-bg-xq-btn" slot="trigger" size="mini" type="primary" 
			          @click="refuse(scope.row)">拒绝
			        </el-button>
			      </template>
		      </el-table-column>
		    </el-table>
				<el-dialog class="g-sdk-details-box" width="30%" min-height="40vh" top="25vh" 
				  :visible.sync="dialogRefuseVisible" @close="closePassVisible" center>
					<div slot="title" class="dialog-title">
				  	<span class="s-refuse-text">审核原因</span>
			    </div>
			    <el-form class="g-form-ipt g-unpass-ta">
			    	<el-input class="s-unpass-ta" type="textarea" :maxlength="DESC_MAX_LENGTH" v-model="refuseCause" placeholder="请填写拒绝原因,200字以内...">
			    	</el-input>
			    </el-form>
			    <div slot="footer" class="dialog-footer">
			    	<el-button type="info" class="g-cancel" size="mini" @click="closePassVisible">
  	          取消
	    	    </el-button>
			    	<el-button type="primary" class="g-cancel" size="mini" @click="refuseSure">
  	          确定
	    	    </el-button>
	    	  </div>
				</el-dialog>
			</el-col>
		</el-row>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
  </div>
</template>
<script>
import { formatTime } from '@/util/dateUtil'
import myPagination from '@/components/my-pagination.vue'
import { queryTaskInfoList, approveAlgorithm, queryApproveRenew } from '@/service/iot-frame'
import { setToken, getToken } from '@/util/storageUtil'
export default {
	components: {
	  myPagination
  },
	data () {
		return {
			activeIndex: '',
			applyAuditShow: false,
			applyOrderShow: false,
			dialogDetailVisible: false,  //详情
			dialogRefuseVisible: false,  //未通过原因
			refuseCause: '',
			arrayType: ['7', '8', '10'],  //7:申请订购  8:退订  9:申请续签
			arrayStatus: ['0', '1'],  //审核类型 0:驳回 1:通过
			refuseRow: '',
			id: '',
			form: {
    	  useObject: '',
        useIP: '',
        useTime: '',
        receptionIP: ''
      },
      formLabelWidth: '35%',
      tableData: [],
      options: [],
      value8: '',
      compCode: '',
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      loading: true
		}
	},
	mounted () {
		this.activeIndex = getToken('APPLY_AUDIT_AX') || '7'
		this.applyAuditShow = this.activeIndex === this.arrayType[1]
		this.applyOrderShow = this.activeIndex === this.arrayType[2]
		this.queryTaskInfoList()
	},
	methods: {
		handleSelect (key, keyPath) {  //切换 -- 表头订购与退订
			let self = this
			self.activeIndex = key
			self.applyAuditShow = key === self.arrayType[1]
			self.applyOrderShow = key === self.arrayType[2]
			self.loading = true
			self.queryTaskInfoList()
		},
		jumpDetails (row, arrayType) {  //跳转到详情
			let self = this
			setToken('APPLY_AUDIT_DETAIL', row)
			setToken('APPLY_AUDIT_AX', self.activeIndex)
			self.$router.push('/applyAuditDetail')
		},
		agree  (row) {  //操作按钮 -- 同意
			let self = this
			let paramData = {
				id: row.id,
				status: self.arrayStatus[1],
				type: '',
				relationId: row.relationId
			}
			if (self.activeIndex === self.arrayType[0]) {
				paramData.type = Number(self.arrayType[0])
				paramData.relationType = '2'
				self.approveAlgorithm(paramData)
			} else if (self.activeIndex === self.arrayType[1]) {
				paramData.type = Number(self.arrayType[1])
				paramData.relationType = '2'
				self.approveAlgorithm(paramData)
			} else {
				paramData.type = Number(self.arrayType[2])
				self.approveRenew(paramData)
			}
		},
		refuse (row) {  //弹框按钮 -- 拒绝
			let self = this
		  self.dialogRefuseVisible = !self.dialogRefuseVisible
		  self.refuseRow = row
		},
		refuseSure () {  //操作按钮 -- 拒绝
			let self = this
			if (self.refuseCause === '') {
				self.$message.warning('请填写拒绝原因')
				return
			}
			let paramData = {
		  	id: self.refuseRow.id,
		  	status: self.arrayStatus[0],
		  	type: '',
		  	relationId: self.refuseRow.relationId,
		  	refuseReason: self.refuseCause
		  }
			if (self.activeIndex === self.arrayType[0]) {
				paramData.type = Number(self.arrayType[0])
				paramData.relationType = '2'
				self.approveAlgorithm(paramData)
			} else if (self.activeIndex === self.arrayType[1]) {
				paramData.type = Number(self.arrayType[1])
				paramData.relationType = '2'
				self.approveAlgorithm(paramData)
			} else {
				paramData.type = Number(self.arrayType[2])
			  self.approveRenew(paramData)
			}
		},
		async approveAlgorithm (paramData) {  //请求 -- 审核
			let self = this
			let resData = await approveAlgorithm(paramData)
			if (resData.data.status != 200 && resData.data.message !== "success") {
				self.$message.error(resData.data.message)
				self.loading = false
				return
			}
			self.$message.success('审核成功')
			self.dialogRefuseVisible = false
			self.queryTaskInfoList()
		},
		async approveRenew (paramData) {  //请求续签同意 -- 审核
			let self = this
			let resData = await queryApproveRenew(paramData)
			if (resData.data.status != 200 && resData.data.message !== "success") {
				self.$message.error(resData.data.message)
				self.loading = false
				return
			}
			self.$message.success('审核成功')
			self.dialogRefuseVisible = false
			self.queryTaskInfoList()
		},
		closePassVisible () {  //关闭模态框
			let self = this
			self.refuseCause = ''
			self.dialogRefuseVisible = false
		},
		changeCur (val) {  //分页切换
			let self = this
  	  self.paginationObj.currentPage = val
  	  self.queryTaskInfoList()
		},
		async queryTaskInfoList () {  //请求 -- 列表数据（订购和退订）
			let self = this
			let paramData = {
				type: Number(self.activeIndex),
				compCode: self.compCode,
				status: '2'
			}
			if (self.activeIndex == '9') {
				paramData.relationType = "4"
			}
			let qParamData = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
			let resData = await queryTaskInfoList(qParamData, paramData)
			if (resData.data.status != 200 || resData.data.message !== "success") {
        self.$message.error(resData.message)
        self.loading = false
        return
			}
		  self.tableData = resData.data.data
		  self.paginationObj.totalCount = resData.data.page.totalRow
		  self.loading = false
		},
		applyForRenew () {
			let self = this;
			self.loading = false
			self.tableData = [
				{
					"id": 710,
					"taskName": "算法退订",
					"taskDesc": "算法退订",
					"status": "2",
					"errorInfo": null,
					"applicant": "1000068140",
					"executor": null,
					"type": 8,
					"relationId": 475,
					"relationType": "2",
					"createTime": "2018-08-15T06:51:47.000+0000",
					"updateTime": "2018-08-15T06:51:47.000+0000",
					"refuseReason": null,
					"sdkName": null,
					"fileName": null,
					"installPackageName": null,
					"person": null,
					"companyInfoId": null,
					"desc": "aaa",
					"algorithmInfoName": "算法求和",
					"unsubscribeReason": "asdf",
					"algorithmId": 119,
					"compName": "中科慧盛",
					"algoStatus": "0",
					"compCode": null
				}
			]
		}
	},
	filters: {
		statusDictionary: (value) => { //status字典
			switch (value) {
				case '0':
				  value = '审核驳回'
				  break
				case '1':
				  value = '审核通过'
				  break
				case '2':
				  value = '未审核'
				  break
			}
			return value
		},
		formatTime1: (value) => { //格式化时间
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		}
	}
}
</script>

<style lang="scss" scoped>
  .g-form-ipt {
  	min-height: 150px;
    .g-item-ipt {
		  width: 80%;
		  height: 35px;
    }
		.g-top-btn {
			margin-left: 120px;
		}
  }
  .s-distribute-btn {
  	margin-right: 30px;
  }
  .g-sdk-details-box {
    .el-dialog .el-dialog__body .el-form-item {
      margin-bottom: 10px;
    }	
	  .s-refuse-text {
	  	font-size: 14px;
	  	padding: 15px;
	  }
	  .g-textarea {
	  	min-height: 100px;
	  }
  }
  .g-cancel {
  	margin-top: 10px;
  }
  .g-mr {
  	margin-right: 10px;
  }
</style>
