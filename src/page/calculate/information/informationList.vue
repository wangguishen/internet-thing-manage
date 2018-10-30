<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>消息列表</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
		  			<!-- <el-input class="g-top-ipt g-search-ipt" placeholder="请输入设备序列号" suffix-icon="el-icon-search" @change="searchCompany()" v-model="searchValue"></el-input> -->
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back('/calculate/index')">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<div class="g-distribute-header">
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item index="0">系统通知</el-menu-item>
				  <el-menu-item index="1">业务提醒</el-menu-item>
				</el-menu>
				<div v-show="facilityManageShow">
					<el-table
			      :data="systemData"
			      style="width: 100%"
			      v-loading="loading">
			      <el-table-column
				      label="消息时间"
				      width="150">
				      <template slot-scope="scope">
				        <el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{scope.row.createTime | formatTime1}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span>{{scope.row.createTime | formatTime1}}</span>
				          </div>
				        </el-popover>
		      		</template>
				    </el-table-column>
			      <el-table-column
			      	label="消息内容">
			        <template slot-scope="scope">
				        <el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{scope.row.content}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span>{{scope.row.content}}</span>
				          </div>
				        </el-popover>
		      		</template>
			      </el-table-column>
			    </el-table>
				</div>
				<div v-show="!facilityManageShow">
					<el-table
			      :data="businessData"
			      style="width: 100%"
			      v-loading="loading">
			      <el-table-column
				      label="消息时间"
				      width="150">
				      <template slot-scope="scope">
				        <el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{scope.row.createTime | formatTime1}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span>{{scope.row.createTime | formatTime1}}</span>
				          </div>
				        </el-popover>
		      		</template>
				    </el-table-column>
			      <el-table-column
			      	label="消息内容">
			        <template slot-scope="scope">
				        <el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{scope.row.content}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span>{{scope.row.content}}</span>
				          </div>
				        </el-popover>
		      		</template>
			      </el-table-column>
			    </el-table>
				</div>
			</div>
			<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</div>
	</div>
</template>
<script>
import { formatTime } from '@/util/dateUtil'
import MyPagination from '@/components/my-pagination'
import {queryMessageList} from '@/service/iot-frame'
export default {
	components: {
		MyPagination
	},
	data () {
		return {
			facilityManageShow: true,
			searchValue: '',
			activeIndex: '0',
			paginationObj: {
				pageSize: 10,
				currentPage: 1,
				totalCount: 0
			},
			businessData: [],
			systemData: [],
			loading: true
		}
	},
	mounted () {
		let self = this;
		let data = {
			status: "1",
			type: self.activeIndex
		}
		console.log(data)
		let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
		self.algorithm(url, data)
	},
	methods: {
		async algorithm (url, data) {  //公共请求方法 -- 请求
			let self = this;
			let algorithmData = await queryMessageList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				let page = algorithmData.data.page;
				self.paginationObj.totalCount = page.totalRow;
				console.log(algorithmData)
				console.log(self.activeIndex)
				for (let i = 0; i < list.length; i++) {
					console.log(list[i])
					if (self.activeIndex == '0') {
						self.systemData.push(list[i])
					} else if (self.activeIndex == '1') {
						self.businessData.push(list[i])
					}
				}
			} else {
				self.$message.error(algorithmData.data.message)
			}
			self.loading = false
		},
		back (path) { //返回计算框架首页
			let self = this;
			self.$router.push(path)
		},
		handleSelect (key, keyPath) { //头部导航切换
			let self = this;
			self.loading = true
			if (key == 0) {
				self.facilityManageShow = true;
				self.systemData = [];
			} else {
				self.facilityManageShow = false;
				self.businessData = [];
			}
			let data = {
				status: "1",
				type: key
			}
			self.activeIndex = key
			let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
			self.algorithm(url, data)
    },
    searchCompany () { //搜索公司
			// let self = this;
		},
		changeCur (val) { //分页按钮点击事件
			let self = this;
			self.loading = true
			let data = {
				status: "1",
				type: self.activeIndex
			}
			let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + val;
			self.systemData = [];
			self.businessData = [];
			self.algorithm(url, data)
		},
		changeSelectIcon (type, row) {
			row.facilityInFlag = !row.facilityInFlag
		},
		selectionChange (selection) {
			let self = this;
			self.facilityTestArr = selection;
		}
	},
	filters: {
		formatTime1: (value) => {  //格式化时间
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		}
	}
}
</script>
<style lang="scss" scoped>
	.g-main{
		text-align: left;
	}
	.l-pad-left{
		padding: 0 5px;
	}
	.g-distribute-header .l-tab-business .has-gutter{
		display: none;
	}
</style>