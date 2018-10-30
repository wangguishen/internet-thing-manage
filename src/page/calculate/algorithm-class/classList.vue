<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>算法范围</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<div class="grid-content bg-purple g-top-right">
		  		<el-input class="g-top-ipt g-search-ipt" placeholder="请输入算法类型" suffix-icon="el-icon-search" @change="searchCompany()" v-model="searchValue"></el-input>
			  	<el-button type="primary" icon="el-icon-plus" class="g-top-btn s-yes-icon" size="mini" 
			  	  @click="$router.push('/classAdd')">新增
			  	</el-button>
	  	    <el-button type="info" class="g-top-btn" size="mini" 
	  	      @click="$router.push('/calculate/index')">返回
	  	    </el-button>
		  	</div>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      class="g-table-all-border">
	      <el-table-column
	        label="算法类型"
	        align="center">
	        <template slot-scope="scope">
	          <span :title="scope.row.typeName">{{scope.row.typeName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="算法数量">
	        <template slot-scope="scope">
	        	<span>{{scope.row.count}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="操作">
	        <template slot-scope="scope">
	        	<el-button class="g-top-btn" slot="trigger" size="mini" type="primary" @click="amendClass(scope.$index, tableData)">修改</el-button>
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
import {queryAlgorithmTypeList} from '@/service/iot-frame'
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
      searchValue: '',
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      loading: true
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		self.queryAlgorithmTypeList()
	},
	methods: {
		async queryAlgorithmTypeList () {  //公共请求方法 -- 请求
			let self = this
			let paramData = {
				"status": "0",
				"typeName": self.searchValue
		  }
			let resData = await queryAlgorithmTypeList('?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage, paramData)
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
    changeCur (val) {  //分页请求
    	let self = this
    	self.paginationObj.currentPage = val
    	self.loading = true
    	self.tableData = []
    	self.queryAlgorithmTypeList()
    },
    searchCompany () {  //搜索分类
			let self = this;
			self.loading = true
			self.tableData = []
			self.queryAlgorithmTypeList()
		},
    amendClass (index, tab) {  //修改操作跳转
    	let self = this;
    	setToken("NOW_CLASS_DATA", tab[index])
    	self.$router.push('/classAmend')
    }
	}
}
</script>
<style lang="scss" scoped>
	
</style>