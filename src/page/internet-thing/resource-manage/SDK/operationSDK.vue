<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>SDK</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-button type="primary" icon="el-icon-plus" class="s-yes-icon" size="mini" 
		  	  @click="$router.push('/operationSDKAdd')">新增
		  	</el-button>
		  	<!-- <el-button class="s-four-text-btn g-top-btn" size="mini" type="primary"
		  	          @click="$router.push('/operationSDKCheck')">
		  	          授权管理
		  	        </el-button> -->
  	    <el-button type="info" class="g-top-btn" size="mini" 
  	      @click="$router.push('/internet-thing/index')">返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      class="g-table-all-border m-pointer-table"
	      @row-click="jumpDetails">
	      <el-table-column
	        label="名称"
	        align="center">
	        <template slot-scope="scope">
	          <span :title="scope.row.sdkName">{{scope.row.sdkName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="描述"
	        align="center">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.sdkDesc}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span class="test">{{scope.row.sdkDesc}}</span>
		          </div>
		        </el-popover>
	  		  </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="版本">
	        <template slot-scope="scope">
	        	<span>{{scope.row.sdkVersion}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="状态">
	        <template slot-scope="scope">
	        	<span>{{scope.row.status || '正常'}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="上传用户">
	        <template slot-scope="scope">
	        	<span>{{scope.row.creator}}</span>
	        </template>
	      </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</el-row>
	</div>
</template>
<script>
import myPagination from '@/components/my-pagination.vue'
import {setToken, getLocalStorage} from '@/util/storageUtil'
import {querySdkInfoList} from '@/service/iot-frame'

export default {
	components: {
		myPagination
	},
	data () {
		return {
		  options: [],
      value8: '',
      tableData: [],
      disabledSet: true,
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
		this.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		this.querySdkInfoList()
	},
	methods: {
		async querySdkInfoList () {
			let self = this
			let paramData = {
				"pageSize": self.paginationObj.pageSize,
				"currentPage": self.paginationObj.currentPage,
		    "compCode": self.compCode
		  }
			let resData = await querySdkInfoList('?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage + '&compCode=' + self.compCode, paramData)
			self.loading = false
    	if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (resData.status === 200 && resData.data.message === 'success') {
				self.paginationObj.totalCount = resData.data.page.totalRow
				let list = resData.data.data
				list.forEach((item, index) => {
					self.tableData.push(item)
				})
			} else {
			  self.$message.error('服务器错误')
			}
		},
    changeCur (val) {
    	let self = this
    	self.paginationObj.currentPage = val
    	self.loading = true
    	self.tableData = []
    	self.querySdkInfoList()
    },
    jumpDetails (row, event, column) {
    	let self = this
    	setToken('SDK_ROW_DETAIL', row)
    	self.$router.push('/operationSDKDetail')
    }
	}
}
</script>
<style lang="scss" scoped>
	
</style>