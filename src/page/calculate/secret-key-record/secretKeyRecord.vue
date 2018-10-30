<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>申请记录</el-breadcrumb-item>
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
	      class="g-table-all-border pointer"
	      @row-click="jumpDetails"
	      v-loading="loading">
	      <el-table-column
		      align="center"
		      label="申请公司"
		      width="130">
		      <template slot-scope="scope">
		      	<span :title="scope.row.compName">{{scope.row.compName}}</span>
		      </template>
		    </el-table-column>
	      <el-table-column
		      align="center"
		      label="公司负责人">
		      <template slot-scope="scope">
	        	<span :title="scope.row.person">{{scope.row.person}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="申请时间">
		      <template slot-scope="scope">
		      	<span>{{scope.row.createTime | formatTime1}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
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
  import myPagination from '@/components/my-pagination.vue'
  import { queryApplicationRecord } from '@/service/iot-frame'
  import { verServer } from '@/service/list'
  import { setToken, getLocalStorage } from '@/util/storageUtil'
  import { formatTime } from '@/util/dateUtil'
	export default {
		components: {
		  myPagination
	  },
		data () {
			return {
				activeIndex: '',
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
		created () {
			let userInfo = getLocalStorage('USER_INFO', 'json')
			this.compCode = userInfo.compCode || ''
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
				self.queryApplicationRecord()
			},
			async queryApplicationRecord () {  //申请记录查询
				let qParamData = `?pageSize=${this.paginationObj.pageSize}&currentPage=${this.paginationObj.currentPage}`
				let params = { compCode: this.compCode }
				let resData = await queryApplicationRecord(qParamData, params)
				this.loading = false
				if (resData.status == 200 && resData.data.message === 'success') {
					this.tableData = resData.data.data
					this.paginationObj.totalCount = resData.data.page.totalRow
				}
			},
			optionsChange (val) {  //切换 -- 企业更换
				let self = this
				self.compCode = val
				self.loading = true
				self.queryApplicationRecord()
			},
			jumpDetails (row, event, column) {  //跳转 -- 详情
				let self = this
				setToken('SECRET_KEY_RECORD', row)
    	  self.$router.push('/skrDetail')
			},
			changeCur (val) {  //分页 -- 查询
				let self = this
    	  self.paginationObj.currentPage = val
    	  self.loading = true
    	  self.queryApplicationRecord()
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
