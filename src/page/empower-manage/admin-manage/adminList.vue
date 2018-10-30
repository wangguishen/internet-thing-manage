<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
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
		  	<button :disabled="disabledSet" @click="$router.push('/compClassChange')" 
		  	  :class="[merName ? 'cursor-pointer' : 'cursor-allowed', 'u-set']">
		  	  <i class="iconfont setting">&#xe60e;</i>
		  	</button>
		  	<el-button type="primary" icon="el-icon-plus" class="s-yes-icon" size="mini" 
		  	  @click="$router.push('/addCompAdmin')">新增
		  	</el-button>
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
          label="帐号"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="所属公司">
          <template slot-scope="scope">
            <span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            width="270">
            <template slot-scope="scope">
              <el-button class="g-top-btn" slot="trigger" size="mini" type="primary"
                @click="deleteAdmin(scope.row)">
                删除
              </el-button>
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
import {setToken, getToken, removeToken} from '@/util/storageUtil'
import { queryAdminList, deleteAdmin } from '@/service/iot-frame'

export default {
	components: {
		myPagination
	},
	data () {
		return {
		  options: [],
      value8: '',
      tableData: [],
      merName: '', //公司名称
      merId: '', //公司内部编号
      merCode: '', //企业编码
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
		let merData = getToken('ADMIN_MERDATA', 'json')
		self.value8 = self.merName = merData === null ? '' : merData.merName
		self.merCode = merData === null ? '' : merData.compCode
		self.disabledSet = !self.merName
		self.queryData()
	},
	methods: {
		async queryData () {
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

			self.queryAdminList()
		},
		async queryAdminList () {
			let self = this
			let qParamData = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
			let paramData = {
				compCode: self.merCode
			}
			let resData = await queryAdminList(qParamData, paramData)
			if (resData.status === 200 && resData.data.message === 'success') {
				self.tableData = resData.data.data
				self.paginationObj.totalCount = resData.data.page.totalRow
			}
			self.loading = false
		},
    changeCur (val) {
    	let self = this
    	self.paginationObj.currentPage = val
    	self.queryAdminList()
    },
    optionsChange (val) {
    	let self = this
    	self.loading = true
    	if (val) {
    		self.merObj = JSON.parse(val)
	    	self.merName = JSON.parse(val).merName
	    	self.merCode = JSON.parse(val).compCode
	    	setToken('ADMIN_MERDATA', val)
    	} else {
    		self.merCode = '';
    		self.merName = '';
    		removeToken('ADMIN_MERDATA')
    	}
  		self.disabledSet = !self.merName
  		self.queryAdminList()
    },
    async deleteAdmin (row) {
    	let self = this
    	let isSuccess = true
    	await self.$confirm('确认删除此管理员吗?', '提示', {
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
      });

      if (!isSuccess) return
      let paramData = {
      	id: row.id
      }
      let resData = await deleteAdmin(paramData)
      if (resData.status == 200 && resData.data.message === 'success') {
      	self.$message.success('删除成功')
      	self.queryAdminList()
      } else {
      	self.$message.error(resData.data.message)
      }
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