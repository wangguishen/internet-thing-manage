<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>实验室授权</el-breadcrumb-item>
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
		    :data="labList"
		    empty-text="暂无数据"
		    class="g-table-all-border"
		    v-loading="loading">
		    <el-table-column
		      align="center"
		      label="实验室名称">
		      <template slot-scope="scope">
	        	<span :title="scope.row.labName">{{scope.row.labName}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="所属企业">
		      <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.companyString}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.companyString}}</span>
		          </div>
		        </el-popover>
      		</template>
		    </el-table-column>
		    <el-table-column
	        label="操作"
	        align="center">
	        <template slot-scope="scope">
	        	<el-button class="g-top-btn" slot="trigger" size="mini" type="primary" @click="amendLab(scope.$index, labList)">修改</el-button>
	        	<el-button class="s-no-bg-xq-btn" slot="trigger" size="mini" plain @click="deleteLab(scope.$index, labList)">删除</el-button>
	        </template>
	      </el-table-column>
		  </el-table>
		</div>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
	</div>
</template>
<script>
import {queryLaboratoryList, deleteLaboratory} from '@/service/iot-frame'
import {setToken, removeToken} from '@/util/storageUtil'
import MyPagination from '@/components/my-pagination'
export default {
	components: {
		MyPagination
	},
	data () {
		return {
			searchValue: '',
			form: {},
			labList: [],
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
		let data = {}
		let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
		self.algorithm(url, data)
	},
	methods: {
		async algorithm (url, data) {  //公共请求方法 -- 请求
			let self = this;
			let algorithmData = await queryLaboratoryList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				console.log(algorithmData)
				let list = algorithmData.data.data;
				let page = algorithmData.data.page;
				self.paginationObj.totalCount = page.totalRow;
				for (let i = 0; i < list.length; i++) {
					let arr = []
					let codes = []
					if (list[i].companyLaboratoryVoList !== null) {
						list[i].companyLaboratoryVoList.forEach((item, index) => {
							arr.push(item.companyName)
							codes.push(item.compCode)
						})
					}
					self.$set(list[i], 'companyString', arr.join('、'))
					self.$set(list[i], 'companyCode', codes)
					self.labList.push(list[i])
				}
			} else {
				self.$message.error(algorithmData.data.message)
			}
			self.loading = false
		},
		back () {  //返回计算框架模板页面
			let self = this;
			removeToken("AMEND_LABORATORY_OBJ")
			self.$router.push('/calculate/index')
		},
		changeCur (val) {  //分页按钮点击事件
			let self = this;
			self.paginationObj.currentPage = val;
			let data = {}
			let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
			self.loading = true
			self.labList = []
			self.algorithm(url, data)
		},
		addCompany () {  //新增实验室按钮
			let self = this;
			self.$router.push('/addLab')
		},
		amendLab (index, tab) {  //修改操作跳转
    	let self = this;
    	setToken("AMEND_LABORATORY_OBJ", tab[index])
    	self.$router.push('/amendLab')
    },
    async deleteLab (index, tab) {  //删除操作
			let self = this
    	let isSuccess = true
    	await self.$confirm('确认删除此实验室吗?', '提示', {
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
			console.log(tab[index])
      if (!isSuccess) return
      let resData = await deleteLaboratory({"id": tab[index].id})
    console.log(resData)
      if (resData.status === 200) {
      	self.$message.success("删除成功")
      	let data = {}
				let url = '?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage;
				self.labList = []
				self.loading = true
				self.algorithm(url, data)
      } else {
      	self.$message.error('服务器错误')
      }
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