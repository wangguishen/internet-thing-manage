<template>
	<div class="appList">
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>应用列表</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-button type="primary" icon="el-icon-plus" class="s-yes-icon" size="mini" 
		  	   @click="addApplication()">新增
		  	</el-button>
  	    <el-button type="info" class="g-top-btn" size="mini" 
  	      @click="back">返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
			<el-table
				v-loading="loading"
      	:data="appListData"
      	empty-text="暂无数据"
      	@row-click="jumpDetails"
      	class="m-pointer-table g-table-all-border">
	      <el-table-column
	        prop="icon"
	        align="center"
	        label="图标"
	        width="120">
	        <template slot-scope="scope">
		      	<template v-if="scope.row.iconUrl != ''">
		      		<img class="s-company-bg-img appIcon" :src="scope.row.iconUrl" alt="" onerror="onerror=null;this.src='/static/image/applyApp.png'">
		      	</template>
		        <template v-else>
		        	<img class="s-company-bg-img appIcon" src="static/image/applyApp.png" alt="">
		        </template>
		      </template>
	      </el-table-column>
	      <el-table-column
	        prop="appName"
	        align="center"
	        label="应用名称">
	        <template slot-scope="scope">
	          <span :title="scope.row.appName">{{scope.row.appName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        prop="pkgName"
	        align="center"
	        label="应用包名">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{ scope.row.pkgName}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span class="test">{{ scope.row.pkgName }}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
	      <el-table-column
	        prop="state"
	        align="center"
	        label="状态">
	      </el-table-column>
	      <el-table-column
	        prop="merName"
	        align="center"
	        label="所属公司">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p class="el-popover-p">{{ scope.row.merName}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span class="test">{{ scope.row.merName }}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
	      <el-table-column
	        prop="isBeta"
	        align="center"
	        label="备注">
	      </el-table-column>
    	</el-table>
    </el-row>
		<!-- </div> -->
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
	</div>
</template>
<script>
import {setToken, getToken, removeToken, getLocalStorage} from '@/util/storageUtil'
import {verServer} from '@/service/list'
import MyPagination from '@/components/my-pagination'
import {formatTime} from '@/util/dateUtil'
export default {
	components: {
		MyPagination
	},
	data () {
		var details = getToken('singleRowDetails', 'json')
		if (details) {
			var currentPages = details.PAGE_STATUS
		}
		return {
			appListData: [],
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
			"commandId": 0x0503,
			"reqNode": "WEB",
			"body": {
				"type": 0,
				"pageSize": self.paginationObj.pageSize,
				"pageIndex": self.paginationObj.currentPage,
				"compCode": self.compCode
			}
		}
		self.queryApplist(data);
	},
	methods: {
		async queryApplist (data) {
			let self = this;
			let appData = await verServer(data)
			self.loading = false
			if (appData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (appData.status == 200 && appData.data.retCode == 0) {
				let appLists = appData.data.body;
				self.paginationObj.totalCount = appLists.totalNum;
				self.appListData = [];
				appLists.appList.forEach(function (item, index) {
					item.pubTime = formatTime(item.pubTime, '{y}/{m}/{d} {h}:{i}')
					item.state = item.state === 'A' ? '正常' : '下架';
					item.isBeta = item.isBeta == '0' ? '正式版' : '测试版';
					self.appListData.push(item)
				})
			} else {
				self.$message.error(appData.data.errMsg)
			}
		},
		addApplication () { //新增应用
			let self = this;
			removeToken('singleRowDetails')
			setToken('ChangeAppState', 'addNew')
			self.$router.push('/addApplication')
		},
		jumpDetails (row, event, column) { //跳转详情页
			let self = this;
			row.PAGE_STATUS = self.paginationObj.currentPage
			setToken('singleRowDetails', row)
			self.$router.push('/applicationDetails')
		},
		back () {
			let self = this;
			removeToken('singleRowDetails')
			self.$router.push('/internet-thing/index')
		},
		async changeCur (val) { //分页事件
			let self = this;
			self.paginationObj.currentPage = val
			self.appListData = [];
			self.loading = true;
			let data = {
				"commandId": 0x0503,
				"reqNode": "WEB",
				"body": {
					"type": 0,
					"pageSize": self.paginationObj.pageSize,
					"pageIndex": val
				}
			}
			let listDatas = await verServer(data)
			self.loading = false;
			if (listDatas.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (listDatas.status == 200 && listDatas.data.retCode == 0) {
				let appLists = listDatas.data.body;
				appLists.appList.forEach(function (item, index) {
					item.pubTime = formatTime(item.pubTime, '{y}/{m}/{d} {h}:{i}')
					item.state = item.state === 'A' ? '正常' : '下架';
					item.isBeta = item.isBeta == '0' ? '正式版' : '测试版';
					self.appListData.push(item)
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.appList {
		.appListHeader{
			height: 30px;
			span {
				display: inline-block;
				float:left;
				font-size: 18px;
			}
			.el-button--info {
				display: inline-block;
				float:right;
			}
			.el-button--primary {
				display: inline-block;
				float:right;
				margin-right:26px;
			}
		}
		.appListContent{
			margin-top:10px;
			img{
				width: 42px;
				height: 32px;
			}
		}	
	}
	.s-company-bg-img{
		display: block;
		width: 24%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 23px;
	}
	.el-popover-p,p {
		text-align: center;
	}
</style>