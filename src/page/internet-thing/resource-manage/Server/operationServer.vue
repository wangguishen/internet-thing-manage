<template>
	<div class="operation-sdk">
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item style="font-size:16px;">服务器环境</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-button type="primary" icon="el-icon-plus" class="s-yes-icon" size="mini" 
		  	  @click="$router.push('/operationServerAdd')">新增
		  	</el-button>
  	    <el-button type="info" class="g-top-btn" size="mini" 
  	      @click="back()">返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableServerData"
	      class="m-pointer-table g-table-all-border"
	      empty-text="暂无数据"
	      @row-click="jumpDetails">
	      <el-table-column
	        label="目的主机IP"
	        align="center">
	        <template slot-scope="scope">
	          <span :title="scope.row.ip">{{scope.row.ip}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="端口"
	        align="center">
	        <template slot-scope="scope">
	        	<span>{{scope.row.port}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="上传用户">
	        <template slot-scope="scope">
	        	<span>{{scope.row.userName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="状态">
	        <template slot-scope="scope">
	        	<span>正常</span>
	        </template>
	      </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</el-row>
	</div>
</template>
<script>
import {getToken, setToken, removeToken, getLocalStorage} from '@/util/storageUtil'
import myPagination from '@/components/my-pagination.vue'
import {queryServerInfoList} from '@/service/iot-frame'
export default {
	components: {
		myPagination
	},
	data () {
		var sigDetail = getToken('operaServerSingData', 'json');
		if (sigDetail) {
			var currentPages = sigDetail.PAGE_STATUS;
		}
		return {
			tableServerData: [],
      paginationObj: {
	      pageSize: 10,
	      currentPage: currentPages || 1,
      	totalCount: 0
      },
      compCode: '',
      loading: true
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		let data = {
			"id": '',
			"compCode": self.compCode
		}
		self.$nextTick(() => {
			self.queryServerlist(data);
		})
	},
	methods: {
		async queryServerlist (data) {
			let self = this;
			let serverData = await queryServerInfoList(`?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}&compCode=${self.compCode}`, data)
			self.loading = false
    	if (serverData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (serverData.status == 200 && serverData.data.message == "success") {
				let serverDataLists = serverData.data;
				self.paginationObj.totalCount = serverDataLists.page.totalRow;
				let resData = serverDataLists.data;
				resData.forEach(function (item, index) {
					self.tableServerData.push(item)
				})
			} else {
				self.$message.error(serverData.data.message)
			}
		},
		jumpDetails (row, event, column) { //跳转详情页面
			let self = this;
			row.PAGE_STATUS = self.paginationObj.currentPage;
			setToken("operaServerSingData", row)
			self.$router.push('/operationServerDetail');
		},
		back () {
			let self = this;
			self.$router.push('/internet-thing/index')
			removeToken('operaServerSingData')
		},
		async changeCur (val) { //分页按钮点击事件
			let self = this;
			self.paginationObj.currentPage = val;
			self.loading = true
			self.tableServerData = []
			let data = {
				"pageSize": self.paginationObj.pageSize,
				"currentPage": val
			}
			let pagData = await queryServerInfoList(`?pageSize=${self.paginationObj.pageSize}&currentPage=${val}`, data);
			self.loading = false
    	if (pagData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (pagData.status == 200 && pagData.data.message == 'success') {
				let resData = pagData.data.data;
				resData.forEach(function (item, index) {
					item.owner = item.owner === "0" ? 'admin' : '';
					self.tableServerData.push(item)
				})
			} else {
				self.$message.error(pagData.data.message)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	$green:#50CB44;
	.operation-sdk{
		.row-bg{
			margin-bottom: 10px;
			.g-top-left{
				font-size: 20px;
			}
			.g-top-right{
				float:right;
			}
			.g-top-btn{
				background-color: $green;
				border-color: $green;
			}
		}
		.block{
			text-align: right;
		}
	}	
	.s-icon-check {
		vertical-align:middle;
	}
</style>