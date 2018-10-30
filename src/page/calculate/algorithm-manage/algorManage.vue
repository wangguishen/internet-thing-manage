<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>算法管理</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn s-yes-icon" size="mini" type="primary" icon="el-icon-plus" @click="addCompany()">新增</el-button>
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-table
		    :data="algorithmList"
		    empty-text="暂无数据"
		    @row-click="jumpDetails"
		    class="m-pointer-table g-table-all-border"
		    v-loading="loading">
		    <el-table-column
		      align="center"
		      label="算法图标"
		      width="130">
		      <template slot-scope="scope">
		      	<template v-if="scope.row.img != ''">
		      		<img class="s-company-bg-img" :src="scope.row.img" alt="" onerror="onerror=null;this.src='static/image/applyApp.png'">
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
		      label="当前版本"
		      width="80">
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="状态"
		      width="80">
		      <template slot-scope="scope">
		        <span>{{scope.row.status | stateDictionary}}</span>
      		</template>
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
		      align="center"
		      label="算法提供方">
		      <template slot-scope="scope">
	        	<span :title="scope.row.creator">{{scope.row.creator}}</span>
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
		</div>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
	</div>
</template>
<script>
import {queryAlgorithmInfoList} from '@/service/iot-frame'
import {setToken, removeToken} from '@/util/storageUtil'
import MyPagination from '@/components/my-pagination'
export default {
	components: {
		MyPagination
	},
	data () {
		return {
			searchValue: '',
			algorithmList: [],
			paginationObj: {
				pageSize: 10,
				currentPage: 1,
				totalCount: 0
			},
			loading: true
		}
	},
	mounted () {
		let self = this;
		let data = {status: '0'}
		let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
		self.algorithm(url, data)
	},
	methods: {
		async algorithm (url, data) {  //公共请求方法 -- 请求
			let self = this;
			let algorithmData = await queryAlgorithmInfoList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				let page = algorithmData.data.page;
				self.paginationObj.totalCount = page.totalRow;
				self.algorithmList = list;
			} else {
				self.$message.error(algorithmData.data.message)
			}
			self.loading = false
		},
		back () {  //返回计算框架模板页面
			let self = this;
			removeToken("ARITHMETIC_OBJECT_ID")
			self.$router.push('/calculate/index')
		},
		jumpDetails (row, event, column) {  //跳转详情页面
			let self = this;
			setToken("ARITHMETIC_OBJECT_ID", row.id)
			self.$router.push('/algorManageDetail')
		},
		changeCur (val) {  //分页按钮点击事件
			let self = this;
			self.paginationObj.currentPage = val;
			let data = {status: '0'}
			let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
			self.algorithm(url, data)
		},
		addCompany () {  //新增公司按钮
			let self = this;
			self.$router.push('/algorManageAdd')
		}
	},
	filters: {
		stateDictionary: (value) => {  //格式化state字段
      value = value === '0' ? '正常' : '异常'
			return value
		}
	}
}
</script>
<style lang="scss" scoped>
	.s-company-bg-img{
		display: block;
		width: 40%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
</style>