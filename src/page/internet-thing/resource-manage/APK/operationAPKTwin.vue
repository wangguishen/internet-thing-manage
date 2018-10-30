<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationAPK'}">安装包</el-breadcrumb-item>
				  <el-breadcrumb-item :to="{path: '/operationAPKDetail'}">详情</el-breadcrumb-item>
				  <el-breadcrumb-item :to="{path: '/operationAPKDistribute'}">分发</el-breadcrumb-item>
				  <el-breadcrumb-item>分发详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/operationAPKDistribute')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
		  	<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item index="1">全部</el-menu-item>
				  <el-menu-item index="2">分发成功</el-menu-item>
				  <el-menu-item index="3">分发失败</el-menu-item>
				  <el-menu-item index="4">分发中</el-menu-item>
				</el-menu>
			  <el-table
		      :data="tableData"
		      class="el-table m-pointer-table g-table-all-border">
		      <el-table-column
		        label="名称"
		        align="center">
		        <template slot-scope="scope">
		          <span :title="scope.row.apkName">{{scope.row.apkName}}</span>
		        </template>
		      </el-table-column>
		      <el-table-column
		        label="大小"
		        align="center">
		        <template slot-scope="scope">
		        	<span>{{scope.row.apkSize | formatPageSize}}</span>
		        </template>
		      </el-table-column>
		      <el-table-column
		        label="目的IP"
		        align="center">
		        <template slot-scope="scope">
		        	<span>{{scope.row.apkDispatcherIp}}</span>
		        </template>
		      </el-table-column>
		      <el-table-column
		        align="center"
		        label="描述">
		        <template slot-scope="scope">
			        <el-popover trigger="hover" placement="top" class="g-scope-hover">
			          <p>{{ scope.row.taskDesc }}</p>
			          <div slot="reference" class="name-wrapper">
			            <span>{{ scope.row.taskDesc }}</span>
			          </div>
			        </el-popover>
			      </template>
		      </el-table-column>
		      <el-table-column
		        align="center"
		        label="状态">
		        <template slot-scope="scope">
			      	<template v-if="scope.row.status == '0'">
			      		<span class="iconfont s-icon-check" style="color:#e3ecf2;">&#xe629;</span>
			      		<span>分发失败</span>
			      	</template>
			      	<template v-if="scope.row.status == '1'">
			      		<span class="iconfont s-icon-check" style="color:#8d0000;">&#xe64f;</span>
			      		<span>分发成功</span>
			      	</template>
			      	<template v-if="scope.row.status == '2'">
			      		<i class="el-icon-loading"></i>
			      		<span>分发中</span>
			      	</template>
			      </template>
		      </el-table-column>
		      <el-table-column
		        align="center"
		        label="分发时间">
		        <template slot-scope="scope">
		        	<span>{{scope.row.createTime}}</span>
		        </template>
		      </el-table-column>
		    </el-table>
	      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
import myPagination from '@/components/my-pagination.vue'
import {getToken, getLocalStore} from '@/util/storageUtil'
import {dispatcherAPKListInfo} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
export default {
	components: {
		myPagination
	},
  data () {
    return {
    	userInfo: {},
      account: '',
      apkDetails: {},
      activeIndex: '1',
      tableData: [],
      paginationObj: {
	      pageSize: 5,
	      currentPage: 1,
      	totalCount: 0
      },
      keyApkdistribute: 1
    };
  },
  mounted () {
		let self = this;
		self.apkDetails = getToken("atPresentAPKDetails", "json")
		self.userInfo = getLocalStore("USER_INFO", "json")
    self.account = self.userInfo.account | self.userInfo.userName
		let data = {
			type: '6',
			applicant: self.account,
			status: ''
		}
		let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
		self.queryAPKlist(url, data);
	},
  methods: {
  	async queryAPKlist (url, data) {
			let self = this;
			let dispatcherData = await dispatcherAPKListInfo(url, data)
			if (dispatcherData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (dispatcherData.status == 200 && dispatcherData.data.status == "200") {
				let list = dispatcherData.data.data
				let page = dispatcherData.data.page
				self.paginationObj.totalCount = page.totalRow
				self.tableData = []
				list.forEach((item, index) => {
					let arr = item.taskDesc.split(/[()]/)
					let dispatcherIp = arr[arr.length - 1].split('分发到')
					self.$set(item, 'apkName', arr[0])
					self.$set(item, 'apkSize', arr[1])
					self.$set(item, 'apkDispatcherIp', dispatcherIp[1])
					item.createTime = formatTime(item.createTime, '{y}/{m}/{d} {h}:{i}')
					item.updateTime = formatTime(item.updateTime, '{y}/{m}/{d} {h}:{i}')
					self.tableData.push(item)
				})
			} else {
				self.$message.error(dispatcherData.data.message)
			}
		},
  	handleSelect (key, keyPath) {
			let self = this
			self.keyApkdistribute = key
			self.paginationObj.currentPage = 1
			let data = {
				type: '6',
				applicant: self.account,
				status: ''
			}
			let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
			if (key == 1) {
				self.queryAPKlist(url, data);
			} else if (key == 2) {
				data.status = '1'
				self.queryAPKlist(url, data);
			} else if (key == 3) {
				data.status = '0'
				self.queryAPKlist(url, data);
			} else if (key == 4) {
				data.status = '2'
				self.queryAPKlist(url, data);
			}
		},
    changeCur (val) {
    	let self = this
    	self.paginationObj.currentPage = val
    	let data = {
				type: '6',
				applicant: self.account,
				status: ''
			}
			let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
			if (self.keyApkdistribute == 1) {
				self.queryAPKlist(url, data);
			} else if (self.keyApkdistribute == 2) {
				data.status = '1'
				self.queryAPKlist(url, data);
			} else if (self.keyApkdistribute == 3) {
				data.status = '0'
				self.queryAPKlist(url, data);
			} else if (self.keyApkdistribute == 4) {
				data.status = '2'
				self.queryAPKlist(url, data);
			}
    }
  },
  filters: {
  	formatPageSize (value) {
  		if (!value) return ''
  		return changePageSize(value, 1)
  	}
  }
};
</script>

<style lang="scss" scoped>
  .g-form-ipt {
    margin-bottom: 60px;
		.g-item-ipt {
			width: 60%;
		}
		.upload-demo {
			margin-left: 10px;
		}
		.s-sure-btn {
			margin-left: 80px;
		}
  }
</style>

