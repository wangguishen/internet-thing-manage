<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>终端设备</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-input class="g-top-ipt g-search-ipt" placeholder="请输入设备序列号" suffix-icon="el-icon-search" @change="searchCompany()" v-model="searchValue"></el-input>
			  		<el-button class="g-top-btn s-yes-icon" size="mini" type="primary" icon="el-icon-plus" @click="addCompany()">新增</el-button>
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-table
				v-loading="loading"
		    :data="companyList"
		    empty-text="暂无数据"
		    class="g-table m-special-table g-table-all-border">
		    <el-table-column
		      align="center"
		      label="设备序列号">
		      <template slot-scope="scope">
	          <span :title="scope.row.sn">{{scope.row.sn}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      prop="appNum"
		      align="center"
		      label="应用数量">
		    </el-table-column>
		    <el-table-column
		      prop="merId"
		      align="center"
		      label="内部公司号">
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="所属公司">
		      <template slot-scope="scope">
		      	<span :title="scope.row.merName">{{scope.row.merName}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="是否支持公测">
		      <template slot-scope="scope">
		      	<template v-if="scope.row.inFlag == '0'">
		      		<span class="iconfont" style="color:#e3ecf2;font-size: 16px;">&#xe68c;</span>
		      	</template>
		      	<template v-else>
		      		<span class="iconfont" style="color:#8d0000;font-size: 16px;">&#xe67e;</span>
		      	</template>
		      </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="操作">
		      <template slot-scope="scope">
		      	<!-- <el-button
		          type="text"
		          icon="el-icon-edit"
		          class="s-edit-icon"
		          @click="editClick(scope.$index, companyList)"></el-button> -->
		        <el-button
		          type="text"
		          icon="el-icon-delete"
		          class="s-delete-icon"
		          @click="deleteClick(scope.$index, companyList)"></el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		</div>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		<el-dialog class="g-sdk-details-box" width="20%" top="25vh" :visible.sync="dialogEditVisible">
			<div slot="title" class="dialog-title">
		  	<span class="s-pass-text">修改</span>
	    </div>
		  <el-form :model="facilityes" class="g-form-ipt">
		    <el-form-item label="设备序列号：" :label-width="formLabelWidth">
		      <el-input class="g-sdk-details-ipt g-item-ipt" v-model="facilityes.sn" disabled></el-input>
		    </el-form-item>
		    <el-form-item class="g-item-ipt g-item-cascader" label="所属公司：" :label-width="formLabelWidth">
		      <el-cascader
            :options="compOptions"
            v-model="selectedOptions2"
            @change="compOptionsChange"
            change-on-select
            filterable
            clearable
            :props="props"
            style="width:80%"
            :placeholder="placeholder">
          </el-cascader>
		    </el-form-item>
		    <el-form-item label="公司名称：" :label-width="formLabelWidth">
		      <el-input class="g-sdk-details-ipt g-item-ipt" v-model="facilityes.merName" disabled></el-input>
		    </el-form-item>
		    <el-form-item :label-width="formLabelWidth">
		      <el-button class="g-top-btn" size="mini" type="primary" @click="facilityBtn()">保存</el-button>
		    </el-form-item>
		  </el-form>
		</el-dialog>
		<el-dialog class="g-sdk-details-box" width="20%" top="25vh" :visible.sync="dialogDeleteVisible">
			<div slot="title" class="dialog-title">
		  	<span class="s-pass-text">删除</span>
	    </div>
	    <div class="s-pass-container">
	    	您确定要删除此数据吗？
	    </div>
			<div slot="footer" class="dialog-footer">
		    <el-button size="mini" class="s-yes-bg-ga-btn" type="info" @click="passCancel()">取 消</el-button>
		    <el-button size="mini" class="s-pass-sure" type="primary" @click="passSure()">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
import {verServer} from '@/service/list'
import {getLocalStorage} from '@/util/storageUtil'
import MyPagination from '@/components/my-pagination'
export default {
	components: {
		MyPagination
	},
	data () {
		return {
			searchValue: '',
			companyList: [],
			paginationObj: {
				pageSize: 10,
				currentPage: 1,
				totalCount: 0
			},
			dialogEditVisible: false,
			dialogDeleteVisible: false,
			facilityes: {
				sn: '',
				merId: '',
				merName: ''
			},
			formLabelWidth: '100px',
			// 企业
			compOptions: [],
			selectedOptions2: [],
			props: {
        label: 'merName',
        value: 'merId'
      },
      atPresentObj: {},
      placeholder: '请选择公司企业',
      compCode: '',
      loading: true
		}
	},
	mounted () {
		let self = this;
		self.compCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		let data = {"commandId": 0x0541, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "sn": self.searchValue, "compCode": self.compCode}}
		self.company(data)
	},
	methods: {
		async companyLists (data, type) {
			let self = this;
			let companyData = await verServer(data)
			if (companyData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (companyData.status == 200 && companyData.data.retCode == 0) {
				if (type == 'a') {
					let list = companyData.data.body.merList
	        self.compOptions = list
				} else if (type == 'b') {
					self.$message({
	          message: '修改设备成功',
	          type: 'success',
	          duration: 1500,
	          center: true
	        });
	        self.selectedOptions2 = []
	        self.facilityes = {
						sn: '',
						merId: '',
						merName: ''
					}
	        self.dialogEditVisible = false;
	        let data = {"commandId": 0x0541, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "sn": self.searchValue, "compCode": self.compCode}}
					self.company(data)
				} else if (type == 'c') {
					self.$message({
	          message: '删除设备成功',
	          type: 'success',
	          duration: 1500,
	          center: true
	        });
	        self.dialogDeleteVisible = false;
	        let data = {"commandId": 0x0541, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "sn": self.searchValue, "compCode": self.compCode}}
					self.company(data)
				}
			} else {
				self.$message.error(companyData.data.errMsg)
			}
		},
		async company (data) {
			let self = this;
			let companyData = await verServer(data)
			self.loading = false
			if (companyData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (companyData.status == 200 && companyData.data.retCode == 0) {
				let obj = companyData.data.body;
				self.paginationObj.totalCount = obj.totalNum;
				obj.deviceList.forEach((item, index) => {
					self.companyList.push(item)
				})
			} else {
				self.$message.error(companyData.data.errMsg)
			}
		},
		back () {  //返回公司列表页面
			let self = this;
			self.$router.push('/internet-thing/index')
		},
		changeCur (val) {  //分页按钮点击事件
			let self = this;
			self.loading = true;
			self.companyList = []
			self.paginationObj.currentPage = val;
			let data = {"commandId": 0x0541, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "sn": self.searchValue, "compCode": self.compCode}}
			self.company(data, self.indexState)
		},
		searchCompany () {  //搜索公司
			let self = this;
			self.loading = true;
			self.companyList = []
			let data = {"commandId": 0x0541, "reqNode": "WEB", "body": {"pageSize": self.paginationObj.pageSize, "pageIndex": self.paginationObj.currentPage, "sn": self.searchValue, "compCode": self.compCode}}
			self.company(data)
		},
		addCompany () {  //新增公司按钮
			let self = this;
			self.$router.push('/facilityAdd')
		},
		editClick (row, tab) {  //编辑按钮
			let self = this;
			self.atPresentObj = tab[row];
			self.facilityes.sn = tab[row].sn
			self.facilityes.merName = tab[row].merName
			self.placeholder = tab[row].merName
			let date = {"commandId": 0x0515, "reqNode": "WEB", "body": {"merId": self.facilityes.merId}};
			self.companyLists(date, 'a')
			self.dialogEditVisible = !self.dialogEditVisible;
		},
		deleteClick (row, tab) {  //删除按钮
			let self = this;
			self.atPresentObj = tab[row];
			self.dialogDeleteVisible = !self.dialogDeleteVisible
		},
		passCancel () {  //取消
			let self = this;
			self.dialogDeleteVisible = false;
		},
		passSure () {  //确定
			let self = this;
			self.loading = true;
			self.companyList = []
			let data = {"commandId": 0x0588, "reqNode": "WEB", "body": {"sn": self.atPresentObj.sn}}
			self.companyLists(data, 'c')
		},
		compOptionsChange (value) {
      let self = this
      if (self.selectedOptions2.length > 0) {
        self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
      }
    },
    compChange (compValue) {  /*改变企业*/
    	let self = this;
    	self.compOptions.forEach((item, index) => {
    		if (item.merId == compValue) {
    			self.facilityes.merId = item.merId;
    			self.facilityes.merName = item.merName;
    		}
    	})
    	// let data =  {compCode: compValue,type: "0"};
			// self.companyLists(data, 'b')
  	},
  	facilityBtn () {  //保存操作
  		let self = this;
  		if (self.facilityes.merId == '') {
  			self.$message({
          message: '请选择公司企业',
          type: 'warning',
          duration: 1500,
          center: true
        });
  		} else {
  			let date = {"commandId": 0x0539, "reqNode": "WEB", "body": {"sn": self.facilityes.sn, "merId": self.facilityes.merId}};
				self.companyLists(date, 'b')
  		}
  	}
	}
}
</script>
<style lang="scss" scoped>
	.s-company-bg-img{
		display: block;
		width: 60%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
	.s-edit-icon, .s-delete-icon{
		font-weight: bold;
		color: #9fa9ba;
		padding: 0px 10px;
	}
	.s-edit-icon{
		font-size: 15px;
	}
	.s-edit-icon:hover{
		color: #8d0000;
	}
	.s-delete-icon:hover{
		color: #eb2929;
	}
	.g-sdk-details-box{
		text-align: left;
		.g-sdk-details-ipt{
			width: 80%;
		}
		.el-dialog{
			.el-dialog__body{
				padding: 25px 15px;
				.s-no-pass-cause{
					padding-left: 20px;
				}
			}
			.dialog-title{
				.s-pass-text{
					margin-left: 20px;
				}
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
	.g-form-ipt{
		min-height: 250px;
	}
	.s-pass-container{
		text-align: center;
		font-size: 18px;
		padding: 15px 0;
	}
	.g-el-dialog{
		margin-top: 20px;
	}
</style>