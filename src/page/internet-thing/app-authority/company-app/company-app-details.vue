<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{ path: '/companyGather' }">公司列表</el-breadcrumb-item>
				  <el-breadcrumb-item :to="{ path: '/companyDetails' }">详情</el-breadcrumb-item>
				  <el-breadcrumb-item :to="{ path: '/companyFacility' }">公司应用列表</el-breadcrumb-item>
				  <el-breadcrumb-item>设置</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="back()">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="12" class="tl">
		    <span>当前设备所属公司:</span>
		    <span>{{merData.merName}}</span>
		  </el-col>
		  <el-col :span="12" class="tl">
		    <span>公司号：</span>
		    <span>{{merData.merId}}</span>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      ref="multipleTable"
	      class="g-table-all-border"
	      @selection-change="handleSelectionChange">
	      <el-table-column
	        type="selection">
	      </el-table-column>
	      <el-table-column
	        label="应用名称"
	        align="left">
	        <template slot-scope="scope">
	        	<span>{{scope.row.appName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="是否展示"
	        align="center">
	        <template slot-scope="scope">
	        	<el-checkbox v-model="scope.row.visible"></el-checkbox>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="当前版本号">
	        <template slot-scope="scope">
	        	<span>{{scope.row.latestVerCode}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="大小">
	        <template slot-scope="scope">
	        	<span>{{scope.row.pkgSize | formatPkgSize}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="上传时间">
	        <template slot-scope="scope">
	        	<span>{{scope.row.pubTime | formatPubTime}}</span>
	        </template>
	      </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur" v-show="false"></my-pagination>
      <el-button class="s-sure-btn g-top-btn fl" size="mini" type="primary" @click="UpdateDeviceAppsReq">保存</el-button>
		</el-row>
	</div>
</template>
<script>
import myPagination from '@/components/my-pagination.vue'
import {getToken, setToken} from '@/util/storageUtil'
import {verServer} from '@/service/list'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
import {deepCopy} from '@/util/arrayUtil'
export default {
	components: {
		myPagination
	},
	data () {
		return {
			companyInfo: {},
      value8: '',
      checked: false,
      allData: [],
      tableData: [],
      compareData: [], //比较后的数组
      merData: {},
      multipleSelection: [],
      appList: [],
      paginationObj: {
	      pageSize: 10000,
	      currentPage: 1,
      	totalCount: 10,
      	saveBtn: 'true'
      },
      loading: true
		}
	},
	mounted () {
		let self = this
		self.allData = getToken('SET_APP_ACCREDIT_LIST', 'json')
		self.merData = getToken('atPresentCompanyDetails', 'json')
		self.companyInfo = getToken("atPresentCompanyDetails", "json")
		self.totalCount = self.tableData.length
		self.getAppsReq()
	},
	methods: {
		back () {  //返回公司详情页面
			let self = this;
			self.$router.push('/companyFacility')
		},
    changeCur (val) {
    },
    handleSelectionChange (val) {
    	let self = this
      self.multipleSelection = val;
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    async getAppsReq () {
    	let self = this
    	let GetAppsReqData = {  //获取应用列表
    		"commandId": 0x0503,
    		"reqNode": "WEB",
    		"body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, type: 0, "compCode": ''}
    	}
    	let resData = await verServer(GetAppsReqData)
    	self.loading = false
    	if (resData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
    	if (resData.data.retCode !== 0) {
				self.$message.error(resData.data.errMsg)
				return
			}
    	self.tableData = resData.data.body.appList
    	self.paginationObj.totalCount = resData.data.body.totalNum
    	self.deleteStateNotA(self.tableData)

    	for (let i in self.tableData) {
    		if (self.tableData[i].state !== "A") {
    			self.tableData.splice(i, 1)
    		}
    	}

    	for (let i in self.tableData) {  //赋值visible
    		for (let j in self.allData) {
    			if (self.tableData[i].appId === self.allData[j].appId) {
    				self.tableData[i].visible = self.allData[j].visible
    				self.$nextTick(() => {
    				  self.toggleSelection([self.tableData[i]])
    				})
    			}
    		}
    	}
    },
    deleteStateNotA (arr) {  //递归删除state不为A的属性
    	let self = this
	    for (let i in arr) {
	    	if (arr[i].state !== "A") {
	    		arr.splice(i, 1)
	    		self.deleteStateNotA(arr)
	    	}
	    }
    },
    async UpdateDeviceAppsReq () {
    	let self = this
    	self.appList = deepCopy(self.multipleSelection, self.appList) //使用深拷贝
    	for (let i in self.appList) {
    		self.appList[i].visible = self.appList[i].visible === true ? 1 : 0
    	}

    	let UpdateDeviceAppsReqData = {
    		"commandId": 0x0519,
    		"reqNode": "WEB",
    		"body": {merId: self.merData.merId, appList: self.appList, "compCode": self.companyInfo.compCode}
    	}
    	let resData = await verServer(UpdateDeviceAppsReqData)
    	if (resData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
    	if (resData.data.retCode !== 0) {
				self.$message.error(resData.data.errMsg)
				return
			}
  		self.$message.success("保存成功")
  		setToken('SET_APP_ACCREDIT_LIST', self.multipleSelection)
    }
	},
	filters: {
    formatPubTime: (value) => { //格式化pubtime
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		},
		formatPkgSize: (value) => { //格式化pgkSize
			if (!value) return ''
			return changePageSize(value, 1)
		}
	}
}
</script>
<style lang="scss" scoped>
  .tl {
  	margin-bottom: 10px;
  	span {
  	  color: #112331;
	  	font-weight: bold;
	  	font-size: 14px;
	  	padding-left: 15px;
  	}
  }
  .g-top-btn {
  	margin-top: 15px;
  }
</style>