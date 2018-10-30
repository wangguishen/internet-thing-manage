<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/algorithmOrder'}">算法订购</el-breadcrumb-item>
				  <el-breadcrumb-item>设置</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/algorithmOrder')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="10" class="tl">
		    <span>当前公司:</span>
		    <span>{{merData.merName}}</span>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
	      :data="tableData"
	      ref="multipleTable"
	      class="g-table-all-border"
	      @selection-change="handleSelectionChange"
	      v-loading="loading">
	      <el-table-column
	        type="selection"
	        class="one">
	      </el-table-column>
	      <el-table-column
	        label="算法图标"
	        align="center">
	        <template slot-scope="scope">
		      	<template v-if="scope.row.img != ''">
		      		<img class="s-company-bg-img" :src="scope.row.img" alt="">
		      	</template>
		        <template v-else>
		        	<img class="s-company-bg-img" src="static/image/company1.png" alt="">
		        </template>
		      </template>
	      </el-table-column>
	      <el-table-column
		      align="center"
		      label="算法名称">
		      <template slot-scope="scope">
	        	<span :title="scope.row.name">{{scope.row.name}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      prop="version"
		      align="center"
		      label="当前版本">
		    </el-table-column>
		    <el-table-column
		      prop="size"
		      align="center"
		      label="大小">
		    </el-table-column>
		    <el-table-column
	        label="算法类型"
	        align="center">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.typeName}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.typeName}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
		    <el-table-column
	        label="上传时间"
	        align="center"
	        min-width="100">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.createTime | formatPubTime}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.createTime | formatPubTime}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
		    <el-table-column
	        label="描述"
	        align="center">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.descption}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.descption}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur" v-on:saveBtnData="saveBtnData"></my-pagination>
		</el-row>
		<my-renew-module
			:showes="dialogVisible"
			:moduleUnreg="moduleUnreg"
			:moduleApply="moduleApply"
			:deploy="deploy"
			v-on:sureClick="UpdateDeviceAppsReq"
			v-on:closeDialogShow="closeDialogShow">
		</my-renew-module>
	</div>
</template>
<script>
import myPagination from '@/components/my-pagination.vue'
import myRenewModule from '@/components/my-renew-module.vue'
import {getToken} from '@/util/storageUtil'
import {queryAlgorithmInfoList, addOrderRecord, queryCompAlgoList} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
import {compareArr, union} from '@/util/arrayUtil'
export default {
	components: {
		myPagination, myRenewModule
	},
	data () {
		return {
      value8: '',
      checked: false,
      allData: [],
      tableData: [],
      compareData: [], //比较后的数组
      merData: {},
      multipleSelection: [],
      appList: [],
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 10,
      	saveBtn: 'true'
      },
      copyArrList: [],
      loading: true,
      paginPage: {},
      dialogVisible: false,
      moduleArr: [],
      moduleUnreg: [], //退订的算法
      moduleApply: [], //申请的算法
      deploy: {
      	name: '申请次数'
      }
		}
	},
	mounted () {
		let self = this
		self.merData = getToken('MER_DATA', 'json')
		self.totalCount = self.tableData.length
		self.getCompanyHasalgor()
	},
	methods: {
		async getCompanyHasalgor () {  //请求 -- 当前企业已订购算法
			let self = this;
			let url = `?pageSize=10000&currentPage=1`;
    	let data = {
    		compCode: self.merData.compCode,
    		status: '0'
    	}
			let algorithmData = await queryCompAlgoList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				list.forEach((item, index) => {
					self.$set(item, 'type', 1)
					self.$set(item, 'disabled', 'disabled')
					self.allData.push(item)
				})
				self.getAppsReq()
			} else {
				self.$message.error(algorithmData.data.message)
			}
			self.loading = false
		},
    changeCur (val) {  //分页查询
    	let self = this;
    	self.paginationObj.currentPage = val
    	self.getAppsReq()
    },
    saveBtnData () { //申请次数弹出框
			let self = this;
			if (self.moduleArr.length == 0) {
				self.$message.warning('请选择您需要更改操作的算法');
			} else {
				self.dialogVisible = !self.dialogVisible
			}
    },
    handleSelectionChange (val) {  //勾选 -- 获取当前值
    	let self = this
    	val.forEach((item, index) => {
    		self.$set(item, 'degree', '')
    	})
      self.multipleSelection = val;
      self.appList = []
    	self.multipleSelection.forEach((item, index) => {
    		self.$set(item, 'degree', '')
    		self.appList.push(item)
    	})
    	self.moduleUnreg = compareArr(self.appList, self.copyArrList)
    	self.moduleApply = compareArr(self.copyArrList, self.appList)
    	self.moduleArr = union(self.moduleUnreg, self.moduleApply)
    },
    toggleSelection (rows) {  //勾选 -- 切换状态
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    async getAppsReq () {  //请求 -- 当前企业可订购所有的算法
    	let self = this
    	let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage + '&compCode=' + self.merData.compCode;
    	let data = {
    		compCode: self.merData.compCode,
    		status: '0'
    	}
    	let algorithmData = await queryAlgorithmInfoList(url, data)
    	if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				let page = algorithmData.data.page;
				self.tableData = []
				self.copyArrList = []
				list.forEach((item, index) => {
					self.$set(item, 'type', 0)
					self.tableData.push(item)
				})
				self.paginationObj.totalCount = page.totalRow;
			} else {
				self.$message.error(algorithmData.data.message)
			}
    	for (let i in self.tableData) {  //赋值visible
    		for (let j in self.allData) {
    			if (self.tableData[i].id === self.allData[j].id) {
    				self.copyArrList.push(self.tableData[i])
    				self.tableData[i].type = self.allData[j].type
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
    async UpdateDeviceAppsReq () {  //授权 -- 订购请求
    	let self = this;
    	for (let item of self.moduleApply) {
				if (item.degree == '') {
    			self.$message.warning(`请填写【${item.name}】申请次数`);
    			return false
    		} else {
    			self.moduleArr = union(self.moduleUnreg, self.moduleApply)
    			console.log(self.moduleArr)
    		}
    	}
  		self.loading = true
    	// let listArr = []
    	let ArrayList = []
    	// self.appList = []
    	// self.multipleSelection.forEach((item, index) => {
    	// 	self.appList.push(item)
    	// })
    	// let arr1 = compareArr(self.appList, self.copyArrList)
    	// let arr2 = compareArr(self.copyArrList, self.appList)
    	// listArr = union(arr1, arr2)
    	self.moduleArr.forEach((item, index) => {
    		let obj = {
	    		algorithmId: item.id,
	    		compCode: self.merData.compCode,
	    		compName: self.merData.merName,
	    		status: '1',
	    		type: item.type,
	    		addNum: item.degree
    		}
    		if (item.type == 1) {
    			obj.unsubscribeReason = "平台管理员取消您的使用算法权限！"
    		}
    		ArrayList.push(obj)
    	})
    	let resData = await addOrderRecord(ArrayList)
    	if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
    	if (resData.data === 'timeout') {
    		self.$message.error("用户登录失效，请重新登录")
    		self.$router.push('/login')
    	} else {
    		self.$message.success("保存成功")
    		self.dialogVisible = false
  			self.loading = true
  			self.tableData = []
  			self.allData = []
	  		self.getCompanyHasalgor()
    	}
    },
    closeDialogShow () {
    	let self = this;
    	self.dialogVisible = false
    }
	},
	filters: {
    formatPubTime: (value) => {  //格式化pubtime
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		},
		formatPkgSize: (value) => {  //格式化pgkSize
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
  .s-company-bg-img{
		display: block;
		width: 40%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
</style>