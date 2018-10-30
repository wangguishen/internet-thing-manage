<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>密钥管理</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-select v-model="selectValue" filterable clearable placeholder="请选择公司名称" size="small" @change="optionsChange" class="g-mr">
			    <el-option
			      v-for="item in options"
			      :key="item.name"
			      :label="item.name"
			      :value="item.value">
			    </el-option>
			  </el-select>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      class="g-table-all-border">
	      <el-table-column
	        label="公司名称"
	        align="center">
	        <template slot-scope="scope">
	          <span :title="scope.row.compName">{{scope.row.compName}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="生成时间">
	        <template slot-scope="scope">
	        	<span>{{scope.row.createTime | formatPubTime}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="AppId">
	        <template slot-scope="scope">
	        	<span>{{scope.row.appid}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="AppKey"
	        min-width="140">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.appkey}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.appkey}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
	      <el-table-column
	        align="center"
	        label="操作">
	        <template slot-scope="scope">
	        	<el-button class="s-four-text-btn" slot="trigger" size="mini" type="primary" @click="amendClass(scope.$index, tableData)">重新生成</el-button>
						<el-switch
							class="l-switch-stl"
						  v-model="scope.row.stateBoole"
						  active-color="#13ce66"
						  inactive-color="#abb9be"
						  @change="switchStatus(scope.$index, tableData)">
						</el-switch>
	        </template>
	      </el-table-column>
	    </el-table>
	    <!-- 删除弹框 -->
			<el-dialog class="g-sdk-details-box" width="26%" top="25vh" :visible.sync="dialogDeleteVisible">
				<div slot="title" class="dialog-title">
			  	<span class="s-pass-text">提示</span>
		    </div>
		    <div class="s-pass-container">
		    	确定重新生成密钥吗？
		    </div>
				<div slot="footer" class="dialog-footer">
			    <el-button size="mini" class="s-yes-bg-ga-btn" type="info" @click="deleteCancel()">取 消</el-button>
			    <el-button size="mini" class="s-pass-sure" type="primary" @click="deleteSure()">确 定</el-button>
			  </div>
			</el-dialog>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</el-row>
	</div>
</template>
<script>
import {formatTime} from '@/util/dateUtil'
import { verServer } from '@/service/list'
import myPagination from '@/components/my-pagination.vue'
import {getLocalStorage} from '@/util/storageUtil'
import {querySecretKeyList, reapplyKey, updateSecretKeyState} from '@/service/iot-frame'
export default {
	components: {
		myPagination
	},
	data () {
		return {
		  options: [],
      selectValue: '',
      tableData: [],
      disabledSet: true,
      compCode: '',
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      loading: true,
      switchValue: true,
      dialogDeleteVisible: false,
      singleObj: {}
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		self.queryData()
	},
	methods: {
		async queryData () {  //请求 -- 企业列表查询
			let self = this
			let GetDeviceListReqData = {
				"commandId": 0x0515,
				"reqNode": "WEB",
				"body": {
					"pageSize": 10000,
					"pageIndex": 1,
					"compCode": self.compCode
				}
			}
			let resData = await verServer(GetDeviceListReqData)
			if (resData.status !== 200) {
				self.$message.error('服务器错误')
				self.loading = false
				return
			}
			if (resData.data.retCode !== 0) {
				self.$message.error(resData.data.errMsg)
				self.loading = false
				return
			}
			let list = resData.data.body.merList
			list.forEach((item, index) => {
				self.options.push({
					name: item.merName,
					value: item.compCode
				})
			})
			self.querySecretKeyList()
		},
		async querySecretKeyList () {  //公共请求方法 -- 请求
			let self = this
			let paramData = {
				"compCode": self.selectValue
		  }
			let resData = await querySecretKeyList('?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage, paramData)
			self.loading = false
    	if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (resData.status === 200 && resData.data.message === 'success') {
				console.log('resData', resData)
				self.paginationObj.totalCount = resData.data.page.totalRow
				let list = resData.data.data
				if (list != null) {
					list.forEach((item, index) => {
						let stateBoole = item.state === '1'
						self.$set(item, 'stateBoole', stateBoole)
						self.tableData.push(item)
					})
				}
			} else {
			  self.$message.error('服务器错误')
			}
		},
    changeCur (val) {  //分页请求
    	let self = this
    	self.paginationObj.currentPage = val
    	self.loading = true
    	self.tableData = []
    	self.querySecretKeyList()
    },
    optionsChange (val) {  //切换 -- 企业更换
			let self = this
			let temp = val.split(',')
			self.compCode = temp[temp.length - 1]
			console.log(self.compCode)
			self.loading = true
			self.tableData = []
			self.querySecretKeyList()
		},
    amendClass (index, tab) {  //重新生成操作跳转
    	let self = this;
    	self.singleObj = tab[index]
    	self.dialogDeleteVisible = !self.dialogDeleteVisible
    },
    async switchStatus (index, val) {
    	let self = this;
    	let single = val[index]
    	let statuData = {
				id: single.id,
				state: single.state
			}
    	let isSuccess = true
    	let str = single.stateBoole ? `确认【${single.compName}】密钥生效吗?` : `确认【${single.compName}】密钥失效吗?`
    	await self.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	isSuccess = true
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除!'
        });
        isSuccess = false
        single.stateBoole = !single.stateBoole
      });
      if (!isSuccess) return
      console.log(isSuccess)
			console.log('statu', statuData)
			let changeState = await updateSecretKeyState(statuData)
    	if (changeState.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (changeState.status === 200 && changeState.data.message === 'success') {
				console.log('changeState', changeState)
				if (changeState.data.data.state == '0') {
					self.$message.warning(single.compName + '密钥已失效')
				} else {
					self.$message.success(single.compName + '密钥已生效')
				}
				self.loading = true
				setTimeout(() => {
					self.tableData = []
					self.querySecretKeyList()
				}, 500)
			} else {
				single.stateBoole = !single.stateBoole
			  self.$message.error('服务器错误')
			}
    },
    deleteCancel () { //取消重新生成
			let self = this;
			self.dialogDeleteVisible = false;
			self.$message.warning('已取消重新生成密钥')
		},
		async deleteSure () {  //确认重新生成
			let self = this;
			let paramData = {
				"id": self.singleObj.id
		  }
			let againCreate = await reapplyKey(paramData)
    	if (againCreate.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (againCreate.status === 200 && againCreate.data.message === 'success') {
				console.log('againCreate', againCreate)
				self.dialogDeleteVisible = false;
				self.$message.success('重新生成密钥成功')
				self.loading = true
				setTimeout(() => {
					self.tableData = []
					self.querySecretKeyList()
				}, 500)
			} else {
			  self.$message.error(againCreate.data.message)
			}
		}
	},
	filters: {
    formatPubTime: (value) => {  //格式化pubtime
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		}
	}
}
</script>
<style lang="scss" scoped>
	.l-switch-stl{
		margin-left: 10px;
	}
	.g-mr {
  	margin-right: 10px;
  }
  .g-sdk-details-box{
		text-align: left;
		.el-dialog{
			.dialog-title{
				.s-pass-text{
					margin-left: 20px;
				}
			}
			.s-pass-container{
				text-align: center;
				font-size: 18px;
				padding: 15px 0;
			}
			.dialog-footer{
				margin-bottom: 20px;
				.s-yes-bg-ga-btn{
					margin-right: 20px;
				}
				.s-pass-sure{
					margin-left: 20px;
				}
			}
		}
	}
</style>