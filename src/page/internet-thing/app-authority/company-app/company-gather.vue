<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>公司应用</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-input class="g-top-ipt g-search-ipt" placeholder="请输入内部公司号" suffix-icon="el-icon-search" @change="searchCompany()" v-model="searchValue"></el-input>
			  		<el-button class="g-top-btn s-yes-icon" size="mini" type="primary" icon="el-icon-plus" @click="addCompany()">新增</el-button>
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-table
				v-loading="loading"
		    :data="companyList"
		    empty-text="暂无数据"
		    @row-click="jumpDetails"
		    class="m-pointer-table g-table-all-border">
		    <el-table-column
		      align="center"
		      label="背景图片"
		      width="130">
		      <template slot-scope="scope">
		      	<template v-if="scope.row.merViewBg != ''">
		      		<img class="s-company-bg-img" :src="scope.row.merViewBg" alt="" onerror="onerror=null;this.src='/static/image/company1.png'">
		      	</template>
		        <template v-else>
		        	<img class="s-company-bg-img" src="static/image/company1.png" alt="">
		        </template>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="merId"
		      align="center"
		      label="内部公司号">
		    </el-table-column>
		    <el-table-column
		      prop="merName"
		      align="center"
		      label="公司简称">
		    </el-table-column>
		    <el-table-column
		      prop="appNum"
		      align="center"
		      label="应用数量">
		    </el-table-column>
		  </el-table>
		</div>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
	</div>
</template>
<script>
import { verServer } from '@/service/list'
import { setToken, getLocalStorage } from '@/util/storageUtil'
import MyPagination from '@/components/my-pagination'
export default {
	components: {
		MyPagination
	},
	data () {
		return {
			searchValue: '',
			companyList: [],
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
		let data = {"commandId": 0x0515, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "merId": self.searchValue, "compCode": self.compCode}}
		self.company(data)
	},
	methods: {
		async company (data) {
			let self = this;
			let companyData = await verServer(data)
			self.loading = false;
			if (companyData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (companyData.status === 200 && companyData.data.retCode == 0) {
				let obj = companyData.data.body;
				self.paginationObj.totalCount = obj.totalNum;
				obj.merList.forEach((item, index) => {
					self.companyList.push(item)
				})
			} else {
				self.$message.error(companyData.data.errMsg)
			}
		},
		back () {  //返回公司列表页面
			let self = this;
			self.$router.push('/internet-thing/index')
		},
		jumpDetails (row, event, column) {  //跳转详情页面
			let self = this;
			setToken("atPresentCompanyDetails", row)
			self.$router.push('/companyDetails')
		},
		changeCur (val) {  //分页按钮点击事件
			let self = this;
			self.paginationObj.currentPage = val;
			self.companyList = [];
			self.loading = true;
			let data = {"commandId": 0x0515, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "merId": self.searchValue}}
			self.company(data)
		},
		searchCompany () {  //搜索公司
			let self = this;
			self.companyList = []
			self.loading = true;
			let data = {"commandId": 0x0515, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "merId": self.searchValue}}
			self.company(data)
		},
		addCompany () {  //新增公司按钮
			let self = this;
			setToken("companyStatusCode", 'add')
			self.$router.push('/companyAdd')
		}
	}
}
</script>
<style lang="scss" scoped>
	.s-company-bg-img{
		display: block;
		width: 60%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
</style>