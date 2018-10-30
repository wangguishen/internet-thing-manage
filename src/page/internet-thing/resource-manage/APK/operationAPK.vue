<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>安装包</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-button type="primary" icon="el-icon-plus" class="s-yes-icon" size="mini" 
		  	  @click="$router.push('/operationAPKAdd')">新增
		  	</el-button>
  	    <el-button type="info" class="g-top-btn" size="mini" 
  	      @click="$router.push('/internet-thing/index')">返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      class="m-pointer-table g-table-all-border"
	      @row-click="jumpDetails">
	      <el-table-column
	        label="名称"
	        align="center">
	        <template slot-scope="scope">
	          <span :title="scope.row.fileName">{{scope.row.fileName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="描述"
	        align="center">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.fileDesc}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.fileDesc}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="版本">
	        <template slot-scope="scope">
	        	<span>{{scope.row.fileVersion}}</span>
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
	        	<span>{{scope.row.userName}}</span>
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
import {queryApkInfoAll} from '@/service/iot-frame'

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
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      compCode: '',
      loading: true
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		let data = {"compCode": self.compCode}
		let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage + '&compCode=' + self.compCode;
		self.queryApkInfoAll(url, data)
	},
	methods: {
		async queryApkInfoAll (url, data) {
			let self = this
			let resData = await queryApkInfoAll(url, data)
			self.loading = false
			if (resData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (resData.status === 200 && resData.data.status === "200") {
				resData.data.data.forEach((item, index) => {
					self.tableData.push(item)
				})
				self.paginationObj.totalCount = resData.data.page.totalRow
			} else {
			  self.$message.error(resData.data.message)
			}
		},
    changeCur (val) {
    	let self = this
    	self.paginationObj.currentPage = val
    	self.loading = true
			self.tableData = []
    	let data = {}
    	let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
			self.queryApkInfoAll(url, data)
    },
    jumpDetails (row, event, column) {  //跳转详情页面
			let self = this;
			setToken("atPresentAPKDetails", row)
			self.$router.push('/operationAPKDetail')
		}
	}
}
</script>
<style lang="scss" scoped>
	.s-icon-check{
    vertical-align: middle
	}
</style>