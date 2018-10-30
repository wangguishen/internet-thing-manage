<template>
	<div>
		<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>密钥审核</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
	      <el-select v-model="selectValue" filterable clearable placeholder="请选择公司名称" size="small" @change="optionsChange" class="g-mr">
			    <el-option
			      v-for="item in options"
			      :key="item.name"
			      :label="item.name"
			      :value="item.value">
			    </el-option>
			  </el-select>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
  	</el-row>
  	<el-row class="g-content">
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
		      	label="公司负责人">
		        <template slot-scope="scope">
			        <span :title="scope.row.person">{{scope.row.person}}</span>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="申请时间">
		        <template slot-scope="scope">
			        {{scope.row.createTime | formatTime}}
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="操作"
		        align="left"
		        width="270">
		        <template slot-scope="scope">
			        <el-button class="g-top-btn" slot="trigger" size="mini" type="primary" 
			          @click="jumpDetails(scope.row)">详情
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
  	</el-row>
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
  	<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
	</div>
</template>
<script>
import { verServer } from '@/service/list'
import { formatTime } from '@/util/dateUtil'
import { querySecretKeyInfoTask, updateTaskInfo, approveSecretKey } from '@/service/iot-frame'
import myPagination from '@/components/my-pagination.vue'
import { setToken } from '@/util/storageUtil'
export default {
	components: {
	  myPagination
  },
	data () {
		return {
			selectValue: '',
			options: [],
			tableData: [],
			loading: true,
			paginationObj: {  //分页
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      dialogRefuseVisible: false,
      refuseCause: '',
      refuseRow: {}
		}
	},
	mounted () {
		// self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		this.queryData()
	},
	methods: {
		async queryData () {  //请求 -- 企业列表查询
			let self = this
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
			list.forEach((item, index) => {
				self.options.push({
					name: item.merName,
					value: item.compCode
				})
			})
			self.querySecretKeyInfoTask()
		},
		async querySecretKeyInfoTask () {  //请求 -- 列表数据（订购和退订）
			let self = this
			let paramData = {
				compCode: self.compCode
			}
			let qParamData = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
			let resData = await querySecretKeyInfoTask(qParamData, paramData)
			if (resData.data.status != 200 || resData.data.message !== "success") {
        self.$message.error(resData.message)
        self.loading = false
        return
			}
		  self.tableData = resData.data.data
		  self.paginationObj.totalCount = resData.data.page.totalRow
		  self.loading = false
		},
		changeCur (val) {  //分页切换
			let self = this
  	  self.paginationObj.currentPage = val
  	  self.querySecretKeyInfoTask()
		},
		optionsChange (val) {  //切换 -- 企业更换
			let self = this
			self.compCode = val
			self.loading = true
			self.querySecretKeyInfoTask()
		},
		jumpDetails (row) {  //跳转到详情
			let self = this;
			setToken('SECRET_KEY_AUDIT_DETAIL', row)
  	  self.$router.push('/secretKeyAuditDetail')
		},
		agree  (row) {  //操作按钮 -- 同意
			let self = this;
			let paramData = {
				id: row.id,
				status: '1',
				relationId: row.relationId
			}
			console.log(row)
			console.log(paramData)
			self.refuseRow = row
			self.approveSecretKey(paramData)
			// self.$message.success('审核成功')
		},
		async approveSecretKey (paramData) {  //请求同意 -- 审核
			let self = this
			let resData = await approveSecretKey(paramData)
			if (resData.data.status != 200 && resData.data.message !== "success") {
				self.$message.error(resData.data.message)
				self.loading = false
				return
			}
			self.$message.success('审核成功')
			self.querySecretKeyInfoTask()
		},
		async updateTaskInfo (paramData) {  //请求拒绝 -- 审核
			let self = this
			let resData = await updateTaskInfo(paramData)
			if (resData.data.status != 200 && resData.data.message !== "success") {
				self.$message.error(resData.data.message)
				self.loading = false
				return
			}
			self.$message.success('申请已拒绝')
			self.dialogRefuseVisible = false
			self.querySecretKeyInfoTask()
		},
		refuse (row) {  //弹框按钮 -- 拒绝
			let self = this;
			self.dialogRefuseVisible = !self.dialogRefuseVisible
		  self.refuseRow = row
		},
		closePassVisible () {  //关闭模态框
			let self = this
			self.refuseCause = ''
			self.dialogRefuseVisible = false
		},
		refuseSure () {  //操作按钮 -- 拒绝
			let self = this
			if (self.refuseCause) {
				let paramData = {
					id: self.refuseRow.id,
					status: '0',
					refuseReason: self.refuseCause
				}
				self.updateTaskInfo(paramData)
			} else {
				self.$message.warning('请填写拒绝原因')
			}
		}
	},
	filters: {
		formatTime: (value) => { //格式化时间
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		}
	}
}
</script>
<style lang="scss" scoped>
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