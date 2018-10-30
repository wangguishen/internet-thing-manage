<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item @click.native="back('/companyGather')">公司列表</el-breadcrumb-item>
					  <el-breadcrumb-item @click.native="back('/companyDetails')">详情</el-breadcrumb-item>
					  <el-breadcrumb-item>{{headerName}}</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<template v-if="facilityManageShow">
			  			<el-input class="g-top-ipt g-search-ipt" placeholder="请输入设备序列号" suffix-icon="el-icon-search" @change="searchCompany()" v-model="searchValue"></el-input>
			  		</template>
			  		<template v-else>
			  			<el-button type="primary" class="s-yes-icon s-four-text-btn" size="mini" @click="appAccredit()">应用授权</el-button>
			  		</template>
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back('/companyDetails')">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<div class="g-distribute-header">
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item index="1">设备管理</el-menu-item>
				  <el-menu-item index="2">应用列表</el-menu-item>
				</el-menu>
				<div v-show="facilityManageShow">
					<el-table
						v-loading="loading"
						ref="multipleTable"
				    :data="facilityList"
				    empty-text="暂无数据"
				    @selection-change="selectionChange"
				    class="g-table m-special-table g-table-all-border">
				    <el-table-column
				    	prop="sn"
				      align="center"
				      label="设备序列号">
				    </el-table-column>
				    <el-table-column
				      prop="appNum"
				      align="center"
				      label="应用数量">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      label="设备状态">
				      <template slot-scope="scope">
				       	<span class="iconfont s-impower-icon" :class="{'impowerIcon':scope.row.state == 'A'}">&#xe629;</span>
				        <span>{{ scope.row.facilityState }}</span>
				      </template>
				    </el-table-column>
			    	<el-table-column
				      header-align="right"
				      type="selection"
				      class-name="m-last-twin-flag">
				    </el-table-column>
				    <el-table-column
				      prop="facilityInFlag"
				      align="left"
				      label="是否支持公测"
				      label-class-name="m-last-flag"
				      class-name="m-last-col-flag">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      label="操作">
				      <template slot-scope="scope">
				       	<el-button
				          size="mini"
				          class="s-no-bg-xq-btn"
				          plain
				          @click.native.prevent="recycleClick(scope.$index, scope.row)">回收</el-button>
				      </template>
				    </el-table-column>
				  </el-table>
				</div>
				<div v-show="!facilityManageShow">
					<el-table
						v-loading="loading"
				    :data="utilityList"
				    style="width: 100%;border: 1px solid #e3e9ec;border-radius: 3px;"
				    empty-text="暂无数据"
				    class="g-table">
				    <el-table-column
				    	prop="appName"
				      align="center"
				      label="应用名称">
				    </el-table-column>
				    <el-table-column
				      prop="versions"
				      align="center"
				      label="当前版本号">
				    </el-table-column>
				    <el-table-column
				    	prop="apkSize"
				      align="center"
				      label="大小">
				    </el-table-column>
				    <el-table-column
				      prop="changeTime"
				      align="center"
				      label="上传时间">
				    </el-table-column>
				  </el-table>
				</div>
			</div>
			<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur" v-on:saveBtnData="saveBtnData"></my-pagination>
		</div>
	</div>
</template>
<script>
import {verServer} from '@/service/list'
import MyPagination from '@/components/my-pagination'
import {getToken, setToken, removeToken} from '@/util/storageUtil'
import {changePageSize} from '@/util/numberUtil'
import {formatTime} from '@/util/dateUtil'
import {union, deepCopy} from '@/util/arrayUtil'
export default {
	components: {
		MyPagination
	},
	data () {
		return {
			companyInfo: {},
			activeIndex: '1',
			indexState: '1',
			facilityManageShow: true,
			facilityList: [],
			utilityList: [],
			searchValue: '',
			facilityObj: {
				commandId: 0x0541
			},
			paginationObj: {
				pageSize: 10,
				currentPage: 1,
				totalCount: 0,
				saveBtn: 'true'
			},
			facilityTestArr: [],
			facilityBackups: [], //备份
			headerName: '公司设备列表',
			loading: true
		}
	},
	mounted () {
		let self = this;
		self.companyInfo = getToken("atPresentCompanyDetails", "json")
		let appStatus = getToken("APP_ACCREDIT_STATUS")
		if (appStatus) {
			self.activeIndex = appStatus
		}
		self.handleSelect(self.activeIndex)
	},
	methods: {
		appAccredit () { //应用授权
			let self = this;
			setToken("APP_ACCREDIT_STATUS", self.indexState)
			setToken('SET_APP_ACCREDIT_LIST', self.utilityList)
			self.$router.push('/companyAppDetails')
		},
		async company (data, key) {
			let self = this;
			let companyData = await verServer(data)
			self.loading = false
			if (companyData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (companyData.status == 200 && companyData.data.retCode == 0) {
				if (key == '1') { //设备管理列表
					let list = companyData.data.body.deviceList;
					let multipleArr = []
					self.facilityList = []
					self.facilityBackups = []
					self.paginationObj.totalCount = companyData.data.body.totalNum
					list.forEach((item, index) => {
						if (item.state == "A") {
							self.$set(item, "facilityState", "已授权")
						} else if (item.state == "U") {
							self.$set(item, "facilityState", "未授权")
						}
						if (item.inFlag == 0) {
							self.$set(item, "facilityInFlag", false)
						} else if (item.inFlag == 1) {
							self.$set(item, "facilityInFlag", true)
							multipleArr.push(item)
							self.facilityBackups.push(item)
						}
						self.facilityList.push(item)
					})
					self.$nextTick(() => {
						multipleArr.forEach(row => {
	            self.$refs.multipleTable.toggleRowSelection(row)
	          });
					})
				} else if (key == '2') { //应用列表
					self.utilityList = []
					let list = companyData.data.body.appList;
					self.paginationObj.totalCount = companyData.data.body.totalNum
					list.forEach((item, index) => {
						let size = changePageSize(item.pkgSize, 1);
						let time = formatTime(item.pubTime, '{y}/{m}/{d} {h}:{i}')
						let versions = item.latestVerCode.toString();
						self.$set(item, "apkSize", size)
						self.$set(item, "changeTime", time)
						self.$set(item, "versions", versions)
						self.utilityList.push(item)
					})
				} else if (key == '3') { //回收设备
					self.$message({
	          message: '回收序列号成功',
	          type: 'success',
		          duration: 1500,
		          center: true
	        });
	        let data = {
	        	"commandId": 0x0541,
	        	"reqNode": "WEB",
	        	"body": {
	        		"pageSize": self.paginationObj.pageSize,
	        		"pageIndex": self.paginationObj.currentPage,
	        		"sn": self.searchValue,
	        		"compCode": self.companyInfo.compCode
	        	}
	        }
	        self.company(data, self.indexState)
				} else if (key == '4') { //修改支持公测状态
					self.$message({
	          message: '修改支持公测成功',
	          type: 'success',
	          duration: 1500,
	          center: true
	        });
					let data = {
						"commandId": 0x0541,
						"reqNode": "WEB",
						"body": {
							"pageSize": self.paginationObj.pageSize,
							"pageIndex": self.paginationObj.currentPage,
							"sn": self.searchValue,
							"compCode": self.companyInfo.compCode
						}
					}
					self.company(data, self.indexState)
				}
			} else {
				self.$message.error(companyData.data.errMsg)
			}
		},
		back (path) { //返回公司详情页面
			let self = this;
			removeToken("APP_ACCREDIT_STATUS")
			self.$router.push(path)
		},
		handleSelect (key, keyPath) { //头部导航切换
			let self = this;
			self.indexState = key;
			self.paginationObj.currentPage = 1;
			self.searchValue = '';
			self.loading = true;
			self.facilityList = []
			self.utilityList = []
			let data = {};
			if (key == 1) {
				self.facilityManageShow = true;
				self.paginationObj.pageSize = 10;
				self.headerName = "公司设备列表"
				self.paginationObj.saveBtn = 'true';
				data = {
					"commandId": 0x0541,
					"reqNode": "WEB",
					"body": {
						"pageSize": self.paginationObj.pageSize,
						"pageIndex": self.paginationObj.currentPage,
						"sn": self.searchValue,
						"compCode": self.companyInfo.compCode
					}
				}
				self.company(data, key)
			} else {
				self.facilityManageShow = false;
				self.headerName = "公司应用列表"
				self.paginationObj.saveBtn = '';
				self.paginationObj.pageSize = 10000;
				data = {
					"commandId": 0x0503,
					"reqNode": "WEB",
					"body": {
						"pageSize": self.paginationObj.pageSize,
						"pageIndex": self.paginationObj.currentPage,
						"type": 0,
						"compCode": self.companyInfo.compCode,
						"isAuthorization": "1"
					}
				}
				self.company(data, key)
			}
    },
    searchCompany () { //搜索公司
			let self = this;
			self.paginationObj.currentPage = 1;
			self.loading = true
			self.facilityList = []
			self.utilityList = []
			let data = {
				"commandId": 0x0541,
				"reqNode": "WEB",
				"body": {
					"pageSize": self.paginationObj.pageSize,
					"pageIndex": self.paginationObj.currentPage,
					"sn": self.searchValue,
					"merId": self.companyInfo.merId
				}
			}
			self.company(data, '1')
		},
		changeCur (val) { //分页按钮点击事件
			let self = this;
			let data = {}
			self.loading = true
			self.facilityList = []
			self.utilityList = []
			self.paginationObj.currentPage = val;
			if (self.indexState == '1') {
				self.paginationObj.pageSize = 10;
				data = {
					"commandId": 0x0541,
					"reqNode": "WEB",
					"body": {
						"pageSize": self.paginationObj.pageSize,
						"pageIndex": val,
						"sn": self.searchValue,
						"compCode": self.companyInfo.compCode
					}
				}
			} else if (self.indexState == '2') {
				self.paginationObj.pageSize = 10000;
				data = {
					"commandId": 0x0503,
					"reqNode": "WEB",
					"body": {
						"pageSize": self.paginationObj.pageSize,
						"pageIndex": self.paginationObj.currentPage,
						"type": 0,
						"compCode": self.companyInfo.compCode,
						"isAuthorization": "1"
					}
				}
			}
			self.company(data, self.indexState)
		},
		changeSelectIcon (type, row) {
			row.facilityInFlag = !row.facilityInFlag
		},
		selectionChange (selection) {
			let self = this;
			self.facilityTestArr = selection;
		},
		recycleClick (index, tab) { //回收
			let self = this;
			let data = {
				"commandId": 0x0537,
				"reqNode": "WEB",
				"body": {
					"sn": tab.sn
				}
			};
			self.company(data, '3')
		},
		saveBtnData (val) {
			let self = this;
			let facilityTestArr = [];
			let facilityBackups = [];
			facilityTestArr = deepCopy(self.facilityTestArr, facilityTestArr)
			facilityBackups = deepCopy(self.facilityBackups, facilityBackups)
			let arr = self.intersection(facilityBackups, facilityTestArr, 'sn');
			let data = {
				"commandId": 0x0533,
				"reqNode": "WEB",
				"body": {
					"deviceList": arr
				}
			}
			self.company(data, '4')
		},
		intersection (array1, array2, name) {
			let result1 = [];
			var result2 = [];
			for (let i = 0; i < array2.length; i++) {
		    let obj = array2[i];
		    let num = obj[name];
		    let isExist = false;
		    for (let j = 0; j < array1.length; j++) {
	        let aj = array1[j];
	        let n = aj[name];
	        if (n == num) {
            isExist = true;
            break;
	        }
		    }
		    if (!isExist) {
	        result1.push(obj);
		    }
			}
			for (let i = 0; i < array1.length; i++) {
		    let obj = array1[i];
		    let num = obj[name];
		    let isExist = false;
		    for (let j = 0; j < array2.length; j++) {
	        let aj = array2[j];
	        let n = aj[name];
	        if (n == num) {
            isExist = true;
            break;
	        }
		    }
		    if (!isExist) {
	        result2.push(obj);
		    }
			}
			// 新增的
			if (result1.length > 0) {
				result1.forEach((item, index) => {
					item.facilityInFlag = !item.facilityInFlag;
					item.inFlag = 1;
				})
			}
			// 取消的
			if (result2.length > 0) {
				result2.forEach((item, index) => {
					item.facilityInFlag = !item.facilityInFlag;
					item.inFlag = 0;
				})
			}
			return union(result1, result2)
		}
	}
}
</script>
<style lang="scss" scoped>
	.el-table_1_column_1.is-left .cell{
		padding-left: 20px;
	}
	.s-impower-icon{
		color: #9fa9ba;
		font-size: 15px;
		font-weight: bold;
	}
	.impowerIcon,.m-select-icon{
		color: #8d0000;
	}
	.m-select-icon{
		font-size: 19px;
	}
	.m-select-default{
		color: #e9f0f4;
	}
	.m-special-table .cell.m-last-flag{
		padding-left: 0;
	}
</style>