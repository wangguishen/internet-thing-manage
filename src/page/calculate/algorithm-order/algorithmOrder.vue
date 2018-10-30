<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>算法订购</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-select v-model="value8" filterable clearable placeholder="请选择公司名称" size="small" @change="optionsChange">
			    <el-option
			      v-for="item in options"
			      :key="item.name"
			      :label="item.name"
			      :value="item.value">
			    </el-option>
			  </el-select>
		  	<button :disabled="disabledSet" @click="$router.push('/algorithmSetting')" 
		  	  :class="[merName ? 'cursor-pointer' : 'cursor-allowed', 'u-set']">
		  	  <i class="iconfont setting">&#xe60e;</i>
		  	</button>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="back">返回</el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
	      :data="tableData"
	      class="g-table-all-border"
	      v-loading="loading">
	      <el-table-column
		      align="center"
		      label="算法图标"
		      width="130">
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
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</el-row>
	</div>
</template>
<script>
import myPagination from '@/components/my-pagination.vue'
import {verServer} from '@/service/list'
import {queryCompAlgoList} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
import {setToken, getToken, removeToken} from '@/util/storageUtil'
export default {
	components: {
		myPagination
	},
	data () {
		return {
		  options: [],
      value8: '',
      tableData: [],
      merName: '',  //设备号
      merId: '',  //公司内部编号
      merCode: '',
      merObj: {},
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
		self.value8 = self.merName = merData === null ? '' : merData.merName
		self.merCode = merData === null ? '' : merData.compCode
		self.disabledSet = !self.merName
		self.queryData()
	},
	methods: {
		async queryData () {  //请求 -- 公司列表
			let self = this
			let GetDeviceListReqData = {
				"commandId": 0x0515,
				"reqNode": "WEB",
				"body": {
					"pageSize": 10000,
					"pageIndex": 1,
					"merId": self.merId
				}
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
			let list = resData.data.body.merList
			list.forEach((item, index) => {
				self.options.push({
					name: item.merName,
					value: JSON.stringify({
						merName: item.merName,
						merId: item.merId,
						compCode: item.compCode
					})
				})
			})
			self.getAppsReq()
		},
    changeCur (val) {  //分页查询
    	let self = this
    	self.paginationObj.currentPage = val
    	self.getAppsReq()
    },
    optionsChange (val) {  //搜索 -- 公司订购算法
    	let self = this
    	self.loading = true
    	if (val) {
    		self.merObj = JSON.parse(val)
	    	self.merName = JSON.parse(val).merName
	    	self.merCode = JSON.parse(val).compCode
	    	setToken('MER_DATA', val)
	    	self.disabledSet = !self.merName
    	} else {
    		self.merCode = '';
    		self.merName = '';
    		self.disabledSet = !self.merName
    		removeToken('MER_DATA')
    	}
	    self.getAppsReq()
    },
    async getAppsReq () {  //请求 -- 算法列表页面
    	let self = this
    	let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`;
    	let data = {
    		compCode: self.merCode,
    		status: '0'
    	}
    	let algorithmData = await queryCompAlgoList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				let page = algorithmData.data.page;
				self.paginationObj.totalCount = page.totalRow;
				self.tableData = list;
			} else {
				self.$message.error(algorithmData.data.message)
			}
			self.loading = false
    },
    back () {  //返回计算框架模块页面
    	let self = this
    	removeToken('MER_DATA')
    	self.$router.push('/calculate/index')
    }
	},
	filters: {
		stateDictionary: (value) => {  //格式化state字段
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
	.s-company-bg-img{
		display: block;
		width: 40%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
</style>