<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>下载记录</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
	      <el-select v-model="value8" filterable placeholder="请选择公司名称" size="small"
	        @change="optionsChange" class="g-mr" clearable>
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
  	  <el-col :span="24">
	  	  <el-table
	      :data="tableData"
	      class="g-table-all-border"
	      v-loading="loading">
	      <el-table-column
		      align="center"
		      label="算法名称"
		      width="130">
		      <template slot-scope="scope">
		      	<span :title="scope.row.name">{{scope.row.name}}</span>
		      </template>
		    </el-table-column>
	      <el-table-column
		      align="center"
		      label="算法类型">
		      <template slot-scope="scope">
	        	<span :title="scope.row.type">{{scope.row.type}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="申请次数(次)">
		      <template slot-scope="scope">
	        	<span>10</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="剩余次数(次)">
		      <template slot-scope="scope">
	        	<span>5</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="下载时间">
		      <template slot-scope="scope">
	      		<el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.createTime | formatTime1}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.createTime | formatTime1}}</span>
		          </div>
		        </el-popover>
		      </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="下载用户">
		      <template slot-scope="scope">
		        <span>{{scope.row.download}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
	        label="用户公司"
	        align="center">
	        <template slot-scope="scope">
		        <span :title="scope.row.compName">{{scope.row.compName || '平台管理员下载'}}</span>
      		</template>
	      </el-table-column>
	    </el-table>
			</el-col>
		</el-row>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
  </div>
</template>

<script>
  import myPagination from '@/components/my-pagination.vue'
  import { queryDownloadRecordList } from '@/service/iot-frame'
  import { verServer } from '@/service/list'
  import { setToken, getToken } from '@/util/storageUtil'
  import { formatTime } from '@/util/dateUtil'
	export default {
		components: {
		  myPagination
	  },
		data () {
			return {
				activeIndex: '',
				applyAuditShow: false,
				arrayType: ['0', '1'],  //0:订购 1:退订
				compCode: '',
				form: {},
        formLabelWidth: '35%',
        tableData: [],
        options: [],
        value8: '',
	      paginationObj: {
		      pageSize: 10,
		      currentPage: 1,
	      	totalCount: 0
	      },
	      loading: true
			}
		},
		mounted () {
			this.activeIndex = getToken('AUDIT_RECORD_AX') || '0'
			this.applyAuditShow = this.activeIndex === this.arrayType[1]
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
				self.queryDownloadRecordList()
			},
			async queryDownloadRecordList () {  //订购退订算法纪录查询
				let self = this
				let qParamData = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
				let paramData = {
					"compCode": self.compCode
				}
				let resData = await queryDownloadRecordList(qParamData, paramData)
				if (resData.data.status != 200 || resData.data.message !== 'success') {
					self.$message.error(resData.data.message)
					self.loading = false
					return
				}
				self.tableData = resData.data.data
				self.paginationObj.totalCount = resData.data.page.totalRow
				self.loading = false
			},
			optionsChange (val) {  //切换 -- 企业更换
				let self = this
				self.compCode = val
				self.loading = true
				self.queryDownloadRecordList()
			},
			jumpDetails (row, event, column) {  //跳转 -- 详情
				let self = this
				setToken('AUDIT_RECORD_DETAIL', row)
				setToken('AUDIT_RECORD_AX', self.activeIndex)
    	  self.$router.push('/auditRecordDetail')
			},
			changeCur (val) {  //分页 -- 查询
				let self = this
    	  self.paginationObj.currentPage = val
    	  self.loading = true
    	  self.queryDownloadRecordList()
			}
		},
		filters: {
			formatTime1: (value) => {  //格式化时间
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
		.g-mr {
			margin-left: 20px;
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
  .font-red {
  	color: red;
  }
</style>
