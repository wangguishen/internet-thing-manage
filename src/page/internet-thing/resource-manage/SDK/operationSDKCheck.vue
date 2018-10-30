<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationSDK'}">SDK</el-breadcrumb-item>
				  <el-breadcrumb-item>授权管理</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationSDK')">
  	      返回
  	    </el-button>
		  </el-col>
  	</el-row>
  	<el-row class="g-content">
  	  <el-col :span="24">
	  	  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item index="null">全部</el-menu-item>
				  <el-menu-item index="3">已审核</el-menu-item>
				  <el-menu-item index="2">未审核</el-menu-item>
				</el-menu>
				<!--  -->
				<el-table
		      :data="tableData"
		      class="g-table-check-border"
		      v-show="distributeOneShow"
		      align="left">
		      <el-table-column
		      	label="名称">
		        <template slot-scope="scope">
			        <span :title="scope.row.sdkName">{{scope.row.sdkName}}</span>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="操作时间">
		        <template slot-scope="scope">
			        {{scope.row.updateTime | formatTime1}}
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="描述">
		        <template slot-scope="scope">
			        <el-popover trigger="hover" placement="top" class="g-scope-hover">
			          <p>{{ scope.row.desc}}</p>
			          <div slot="reference" class="name-wrapper">
			            <span>{{ scope.row.desc }}</span>
			          </div>
			        </el-popover>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="审核结果">
						<template slot-scope="scope">
			        {{scope.row.status | statusDictionary}}
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="操作"
		        align="left"
		        min-width="150">
		        <template slot-scope="scope">
			        <el-button class="s-select-btn g-top-btn" slot="trigger" size="mini" type="primary" 
			          @click="detail(scope.row)">详情
			        </el-button>
			        <el-button type="info" class="g-top-btn" size="mini" @click="pass(scope.row)"
			          v-show="scope.row.status === status[3] ? true : false">
  	            通过
  	    	    </el-button>
			        <el-button type="info" class="g-top-btn" size="mini" @click="checkCause(scope.row)"
			          v-show="scope.row.status === status[3] ? true : false">
		  	        未通过
		  	      </el-button>
		  	      <el-button type="primary" class="s-yes-bg-xa-btn s-five-text-btn" size="mini"
		  	        @click="unpass(scope.row)" v-show="scope.row.status === status[1] ? true : false">
		  	        未通过原因
		  	      </el-button>
		  	      <el-button type="primary" class="s-yes-bg-xa-btn s-three-text-btn" size="mini"
		  	        v-show="scope.row.status === status[2] ? true : false" disabled="disabled">
		  	        已通过
		  	      </el-button>
			      </template>
		      </el-table-column>
		    </el-table>
				
				<el-dialog class="g-sdk-details-box" width="20%" top="25vh" min-height="50vh"
				  :visible.sync="dialogDetailVisible" @close="detailClose">
					<div slot="title" class="dialog-title">
				  	<span class="s-pass-text">查看详情</span>
			    </div>
			    <div>
			    	<el-form :model="detailForm" class="g-form-ipt" disabled="disabled">
			    	  <el-form-item label="大小:" :label-width="formLabelWidth">
					      <el-input v-model="detailForm.sdkSize" auto-complete="off" class="g-item-ipt fl"></el-input>
					    </el-form-item>
					    <el-form-item label="路径:" :label-width="formLabelWidth">
					      <el-input v-model="detailForm.storagePath" auto-complete="off" class="g-item-ipt fl"></el-input>
					    </el-form-item>
					    <el-form-item label="版本:" :label-width="formLabelWidth">
					      <el-input v-model="detailForm.sdkVersion" auto-complete="off" class="g-item-ipt fl"></el-input>
					    </el-form-item>
					    <el-form-item label="名称:" :label-width="formLabelWidth">
					      <el-input v-model="detailForm.sdkName" auto-complete="off" class="g-item-ipt fl"></el-input>
					    </el-form-item>
					    <el-form-item label="上传人:" :label-width="formLabelWidth">
					      <el-input v-model="detailForm.creator" auto-complete="off" class="g-item-ipt fl"></el-input>
					    </el-form-item>
			    	</el-form>
			    </div>
				</el-dialog>
				
				<!-- 未通过原因 -->
				<el-dialog class="g-sdk-details-box" width="30%" min-height="30vh" top="25vh" 
				  :visible.sync="dialogUnpassVisible">
					<div slot="title" class="dialog-title">
				  	<span class="s-pass-text">未通过原因</span>
			    </div>
			    <el-form class="g-form-ipt g-unpass-ta" disabled="disabled">
			    	<el-input type="textarea" v-model="unpassCause"></el-input>
			    </el-form>
				</el-dialog>
				
				<!-- 已审核 -->
				<el-dialog class="g-sdk-details-box" width="30%" min-height="40vh" top="25vh" 
				  :visible.sync="dialogCheckVisible" @close="closePassVisible" center>
					<div slot="title" class="dialog-title">
				  	<span class="s-pass-text">审核原因</span>
			    </div>
			    <el-form class="g-form-ipt g-unpass-ta">
			    	<el-input class="s-unpass-ta" type="textarea" v-model="checkCauseText"></el-input>
			    </el-form>
			    <div slot="footer" class="dialog-footer">
			    	<el-button type="info" class="g-cancel" size="mini" @click="closePassVisible">
  	          取消
	    	    </el-button>
			    	<el-button type="primary" class="g-cancel" size="mini" @click="updateTaskInfo(status[1])">
  	          确定
	    	    </el-button>
	    	  </div>
				</el-dialog>
			</el-col>
		</el-row>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
  </div>
</template>

<script>
	import { formatTime } from '@/util/dateUtil'
  import { querySdkInfo, queryTaskInfo, queryTaskInfoList, updateTaskInfo } from '@/service/iot-frame'
  import { changePageSize } from '@/util/numberUtil'
  import myPagination from '@/components/my-pagination.vue'
	export default {
		components: {
		  myPagination
	  },
		data () {
			return {
				activeIndex: 'null',
				distributeOneShow: true,
				dialogDetailVisible: false,  //详情
				dialogCheckVisible: false,  //审核原因
				dialogUnpassVisible: false,  //未通过原因
				statusShow: false,  //审核状态显示
				unpassCause: '',
				checkCauseText: '',
				type: 4,  //任务类型
				status: [null, '0', '1', '2'],  //审核 null 默认状态, 0驳回,1通过,2未审核
				id: '',
				form: {
      	  useObject: '',
          useIP: '',
          useTime: '',
          receptionIP: ''
        },
        detailForm: {},
        formLabelWidth: '35%',
        tableData: [{
	        useObject: '',
	        useIP: '',
	        useTime: '',
	        receptionIP: ''
	      }],
	      paginationObj: {
		      pageSize: 10,
		      currentPage: 1,
	      	totalCount: 0
	      }
			}
		},
		mounted () {
			this.queryTaskInfoList()
		},
		methods: {
			handleSelect (key, keyPath) {
				let self = this
				if (key === "null") key = null
				self.status[0] = key
				self.queryTaskInfoList()
			},
			detail (row) {
				let self = this
				self.dialogDetailVisible = !self.dialogDetailVisible
				let relationId = row.relationId
				if (relationId) {
					self.querySdkInfo(relationId)
				}
			},
			checkCause (row) {
				let self = this
				self.dialogCheckVisible = !self.dialogCheckVisible
				self.id = row.id
			},
			pass (row) {
				let self = this
				self.id = row.id
				self.updateTaskInfo(self.status[2])
			},
			unpass (row) {
				let self = this
				self.dialogUnpassVisible = !self.dialogUnpassVisible
				self.queryTaskInfo(row.id)
			},
			closePassVisible () {
				let self = this
				self.checkCauseText = ''
				self.dialogCheckVisible = false
			},
			changeCur (val) {
				let self = this
    	  self.paginationObj.currentPage = val
    	  self.queryTaskInfoList()
			},
			async queryTaskInfoList () {
				let self = this
				let paramData = {
					'pageSize': self.paginationObj.pageSize,
					'currentPage': self.paginationObj.currentPage,
					'type': self.type,
					'status': self.status[0]
				}
				let resData = await queryTaskInfoList('?pageSize=' + self.paginationObj.pageSize + '&currentPage=' + self.paginationObj.currentPage, paramData)
				if (resData.status === 200) {
					self.paginationObj.totalCount = resData.data.page.totalRow
					self.tableData = resData.data.data
				} else {
					self.$message.error('服务器错误')
				}
			},
			async querySdkInfo (id) {
				let self = this
				let resData = await querySdkInfo({ "id": id })
				if (resData.status === 200) {
					self.detailForm = resData.data.data
					self.detailForm.sdkSize = changePageSize(self.detailForm.sdkSize, 1)
				} else {
					self.$message.error('服务器错误')
				}
			},
			async queryTaskInfo (id) {
				let self = this
				let resData = await queryTaskInfo({ "id": id })
				if (resData.status === 200) {
					self.unpassCause = resData.data.data.taskDesc
				} else {
					self.$message.error('服务器错误')
				}
			},
			detailClose () {
				let self = this
				self.detailForm = {}
			},
			async updateTaskInfo (status) {
				let self = this
				let paramData = { "taskDesc": self.checkCauseText, "id": self.id, "status": status }
				let resData = await updateTaskInfo(paramData)
				if (resData.status === 200) {
					self.dialogCheckVisible = false
					self.$message.success('操作成功')
					self.queryTaskInfoList()
				} else {
					self.$message.error('服务器错误')
				}
			}
		},
		filters: {
			statusDictionary: (value) => { //status字典
				switch (value) {
					case '0':
					  value = '审批驳回'
					  break
					case '1':
					  value = '审批通过'
					  break
					case '2':
					  value = '未审核'
					  break
				}
				return value
			},
			formatTime1: (value) => { //格式化时间
				if (!value) return ''
				return formatTime(value)
			}
		}
	}
</script>

<style lang="scss" scoped>
  .g-form-ipt {
  	// margin-top: 15px;
  	min-height: 150px;
    .g-item-ipt {
		  width: 80%;
		  height: 35px;
    }
		.g-top-btn {
			margin-left: 120px;
		}
  }
  .s-distribute-btn {
  	margin-right: 30px;
  }
  .g-sdk-details-box {
    .el-dialog .el-dialog__body .el-form-item {
      margin-bottom: 10px;
    }	
	  .s-pass-text {
	  	font-size: 14px;
	  	padding: 15px;
	  }
	  .g-textarea {
	  	min-height: 100px;
	  }
  }
  .g-cancel {
  	margin-top: 10px;
  }
</style>
