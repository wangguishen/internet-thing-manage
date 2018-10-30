<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>终端权限</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-select v-model="value8" filterable clearable placeholder="请选择设备序列号" size="small" @change="optionsChange">
			    <el-option
			      v-for="item in options"
			      :key="item.name"
			      :label="item.name"
			      :value="item.value">
			    </el-option>
			  </el-select>
		  	<button :disabled="disabledSet" @click="$router.push('/terminal-authority/setting')" 
		  	  :class="[sn ? 'cursor-pointer' : 'cursor-allowed', 'u-set']">
		  	  <i class="iconfont setting">&#xe60e;</i>
		  	</button>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="back">返回</el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      class="g-table-all-border">
	      <el-table-column
	        label="应用名称"
	        align="center">
	        <template slot-scope="scope">
	          <span>{{scope.row.appName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="当前版本号"
	        align="center">
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
	      <el-table-column
	        align="center"
	        label="应用状态">
	        <template slot-scope="scope">
	        	<span>{{scope.row.state | stateDictionary}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="公测状态">
	        <template slot-scope="scope">
	        	<span>{{scope.row.isBeta === 0 ? '正式版' : '测试版'}}</span>
	        </template>
	      </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</el-row>
	</div>
</template>
<script>
import myPagination from '@/components/my-pagination.vue'
import {verServer} from '@/service/list'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
import {setToken, getToken, removeToken, getLocalStorage} from '@/util/storageUtil'

export default {
	components: {
		myPagination
	},
	data () {
		return {
		  options: [],
      value8: '',
      tableData: [],
      sn: '', //设备号
      merId: '', //公司内部编号
      compCode: '', //企业编码
      disabledSet: true,
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      loading: true
		}
	},
	mounted () {
		let self = this
		let merData = getToken('MER_DATA', 'json')
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		self.value8 = self.sn = merData === null ? '' : merData.sn
		self.disabledSet = !self.sn
		self.queryData()
	},
	methods: {
		async queryData () {
			let self = this
			let GetDeviceListReqData = {  //获取设备列表号
				"commandId": 0x0541,
				"reqNode": "WEB",
				"body": {"pageSize": 10000, "sn": self.merId, "compCode": self.compCode}
			}
			let resData = await verServer(GetDeviceListReqData)
			if (resData.status !== 200) {
				self.$message.error('服务器错误')
				return
			}
			if (resData.data.retCode !== 0) {
				self.$message.error(resData.data.errMsg)
				return
			}
			let list = resData.data.body.deviceList
			list.forEach((item, index) => {
				self.options.push({
					name: item.sn,
					value: JSON.stringify({
						sn: item.sn,
						merId: item.merId,
						merName: item.merName
					})
				})
			})
			self.getAppsReq()
		},
    changeCur (val) {
    	let self = this
    	self.paginationObj.currentPage = val
    	self.loading = true
    	self.tableData = []
    	self.getAppsReq()
    },
    optionsChange (val) {
    	let self = this
    	if (val) {
    		self.sn = JSON.parse(val).sn
	    	setToken('MER_DATA', val)
	    	self.disabledSet = !self.sn
    	} else {
    		self.sn = '';
    		self.disabledSet = !self.sn
    		removeToken('MER_DATA')
    	}
    	self.loading = true
    	self.tableData = []
    	self.getAppsReq()
    },
    async getAppsReq () {
    	let self = this
    	let GetAppsReqData = { //获取应用列表
    		"commandId": 0x0503,
    		"reqNode": "WEB",
    		"body": {"sn": self.sn, "pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, type: 0, "compCode": self.compCode}
    	}
    	let resData = await verServer(GetAppsReqData)
    	self.loading = false
    	if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
    	if (resData.data.retCode !== 0) {
				self.$message.error('服务器错误,' + resData.data.errMsg)
				return
			}
			let tableDataObj = resData.data.body.appList
			tableDataObj.forEach((item, index) => {
				self.tableData.push(item)
			})
    	setToken('SET_TERMINAL_AUTHORITY_LIST', self.tableData)
    	self.paginationObj.totalCount = resData.data.body.totalNum
    },
    back () {
    	let self = this
    	removeToken('MER_DATA')
    	removeToken('SET_TERMINAL_AUTHORITY_LIST')
    	self.$router.push('/internet-thing/index')
    }
	},
	filters: {
		stateDictionary: (value) => { //格式化state字段
			switch (value) {
				case 'A':
				  value = '正常'
				  break;
				case 'U':
				  value = '无权'
				  break;
				case 'L':
				  value = '权限锁定'
				  break;
				default:
					value = '下架'
			}
			return value
		},
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
	.setting {
	  color: #9fa9ba;
	  font-size: 14px;
	}
	.u-set {
		background: #fff;
		text-align: center;
		width: 32px;
		height: 32px;
		border-radius: 3px;
		border: 1px solid #dee8ef;
		margin: 0 15px;
		cursor: not-allowed;
		outline: none;
	}
	.cursor-pointer {
		cursor: pointer
	}
	.cursor-allowed {
		cursor: not-allowed;
	}
</style>