<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>申请记录</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
	      <el-select v-model="value8" filterable clearable placeholder="请选择公司名称" size="small"
	        @change="optionsChange" class="g-mr">
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
	  	  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item :index="arrayType[0]">申请订购</el-menu-item>
				  <el-menu-item :index="arrayType[1]">退订</el-menu-item>
				  <el-menu-item :index="arrayType[2]">续签申请</el-menu-item>
				</el-menu>
				<el-table
		      :data="tableData"
		      class="g-table-check-border pointer"
		      align="left"
		      @row-click="jumpDetails"
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
			        <span :title="scope.row.algoName">{{scope.row.algoName}}</span>
	      		</template>
		      </el-table-column>
		      <template v-if="activeIndex == '2'">
		      	<el-table-column
			        label="续签次数/天数">
		      		<template slot-scope="scope">
			        	<template v-if="scope.row.addNum != 0">
			        		<span>{{scope.row.addNum}}次</span>
			        	</template>
				        <template v-else>
			        		<span>{{scope.row.addDay}}天</span>
			        	</template>
		      		</template>
			      </el-table-column>
		      </template>
		      <el-table-column
		        label="申请时间">
		        <template slot-scope="scope">
			        <span>{{scope.row.createTime | formatTime1}}</span>
	      		</template>
		      </el-table-column>
		      <template v-if="applyAuditShow">
			      <el-table-column
			        label="退订原因">
		      		<template slot-scope="scope">
			      		<el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{ scope.row.unsubscribeReason}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span>{{ scope.row.unsubscribeReason }}</span>
				          </div>
				        </el-popover>
				      </template>
			      </el-table-column>
		      </template>
		      <template v-if="applyOrderShow">
		      	<el-table-column
			        label="申请次数(次)">
			        <template slot-scope="scope">
				       	{{scope.row.addNum}}
		      		</template>
			      </el-table-column>
		      </template>
		      <el-table-column
		        label="描述">
		        <template slot-scope="scope">
			        <el-popover trigger="hover" placement="top" class="g-scope-hover">
			          <p>{{ scope.row.desc}}</p>
			          <div slot="reference" class="name-wrapper">
			            <span>{{ scope.row.desc }}</span>
			          </div>
			        </el-popover>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="状态">
						<template slot-scope="scope">
			        <span :class="[scope.row.status === '0' ? 'font-red' : '']">
			          <template v-if="scope.row.status === '0'">
			            <span>拒绝</span>
			          </template>
			          <template v-if="scope.row.status === '1'">
			          	<span>同意</span>
			          </template>
			          <template v-if="scope.row.status === '2'">
			          	<span>待审核</span>
			          </template>
			        </span>
	      		</template>
		      </el-table-column>
		    </el-table>
			</el-col>
		</el-row>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
  </div>
</template>

<script>
	import { formatTime } from '@/util/dateUtil'
  import myPagination from '@/components/my-pagination.vue'
  import { queryCompanyRecord, queryRenewRecord } from '@/service/iot-frame'
  import { verServer } from '@/service/list'
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
				arrayType: ['0', '1', '2'],  //0:订购 1:退订
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
			this.applyOrderShow = this.activeIndex === this.arrayType[0];
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
				self.queryCompanyRecord()
			},
			async queryCompanyRecord () {  //订购退订算法纪录查询
				let self = this
				let qParamData = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
				let paramData = {
					"compCode": self.compCode,
					"type": Number(self.activeIndex),
					"pageSize": self.paginationObj.pageSize,
					"currentPage": self.paginationObj.currentPage
				}
				let resData;
				if (self.activeIndex == '2') {
					paramData.type = 1
					console.log(paramData)
					resData = await queryRenewRecord(qParamData, paramData)
				} else {
					resData = await queryCompanyRecord(qParamData, paramData)
				}
				// let resData = await queryCompanyRecord(qParamData, paramData)
				if (resData.data.status != 200 || resData.data.message !== 'success') {
					self.$message.error(resData.data.message)
					self.loading = false
					return
				}
				self.tableData = resData.data.data
				self.paginationObj.totalCount = resData.data.page.totalRow
				self.loading = false
			},
			handleSelect (key, keyPath) {  //切换 -- 表头订购与退订
				let self = this
				self.applyAuditShow = key === self.arrayType[1]
				self.applyOrderShow = key === self.arrayType[0];
				self.activeIndex = key
				self.loading = true
				self.queryCompanyRecord()
			},
			optionsChange (val) {  //切换 -- 企业更换
				let self = this
				// let temp = val.split(',')
				// console.log(temp)
				self.compCode = val
				self.loading = true
				self.queryCompanyRecord()
			},
			jumpDetails (row, event, column) {  //跳转 -- 详情
				let self = this
				console.log(row)
				setToken('AUDIT_RECORD_DETAIL', row)
				setToken('AUDIT_RECORD_AX', self.activeIndex)
    	  self.$router.push('/auditRecordDetail')
			},
			changeCur (val) {  //分页 -- 查询
				let self = this
    	  self.paginationObj.currentPage = val
    	  self.loading = true
    	  self.queryCompanyRecord()
			}
		},
		filters: {
			statusDictionary: (value) => {  //status字典
				switch (value) {
					case '0':
					  value = '正常'
					  break
					case '1':
					  value = '审批通过'
					  break
					case '2':
					  value = '未审核'
					  break
				}
				return value
			},
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
