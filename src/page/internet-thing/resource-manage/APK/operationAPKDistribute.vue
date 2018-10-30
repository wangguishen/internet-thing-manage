<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationAPK'}">安装包</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/operationAPKDetail'}">详情</el-breadcrumb-item>
				  <el-breadcrumb-item>分发</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-button class="s-sure-btn g-top-btn s-four-text-btn" size="mini" type="primary" 
          @click="$router.push('/operationAPKTwin')">
          分发详情
        </el-button>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationAPKDetail')">
  	      返回
  	    </el-button>
		  </el-col>
  	</el-row>
  	<el-row class="g-content">
  	  <el-col :span="24">
	  	  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item index="1">单点分发</el-menu-item>
				  <el-menu-item index="2">多点分发</el-menu-item>
				</el-menu>
				<!-- 单点分发 -->
				<el-form :model="form" class="g-form-ipt tl" v-show="distributeOneShow" :rules="rules" ref="form">
			    <el-form-item label="使用对象：" :label-width="formLabelWidth" prop="useObject">
			      <el-input v-model="form.useObject" auto-complete="off" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="接收IP：" :label-width="formLabelWidth" prop="acceptIp">
			      <!-- <el-input v-model="form.receptionIP" auto-complete="off" class="g-item-ipt"></el-input> -->
			      <el-cascader
					    :options="serverOption"
					    v-model="selectedOption"
            	@change="compOptionsChange"
            	change-on-select
	            filterable
	            clearable
	            :props="props"
	            placeholder="请选择服务器IP">
					  </el-cascader>
			    </el-form-item>
		      <el-button class="s-sure-btn g-top-btn s-sure" size="mini" type="primary" @click="singleSure">确定</el-button>
			  </el-form>
				<!-- 多点分发 -->
				<el-table
		      :data="tableData"
		      class="g-table-all-border"
		      v-show="!distributeOneShow">
		      <el-table-column
		      	label="使用对象">
		        <template slot-scope="scope">
			        <el-input class="g-item-ipt" v-model="scope.row.useObject"></el-input>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="接收IP">
						<template slot-scope="scope">
			        <!-- <el-input class="g-item-ipt" v-model="scope.row.receptionIP"></el-input> -->
			        <el-cascader
						    :options="scope.row.serverOption"
						    v-model="scope.row.selectedOption"
	            	@change="compOptionsChanges"
	            	change-on-select
		            filterable
		            clearable
		            :props="props"
		            placeholder="请选择服务器IP">
						  </el-cascader>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="操作"
		        align="center">
		        <template slot-scope="scope">
			        <el-button 
			        	size="mini" 
			        	icon="el-icon-plus"
			        	class="s-distribute-btn" 
			        	circle 
			        	type="primary" 
			        	@click.native.prevent="distributeAdd(scope.$index, scope.row)">	
			        </el-button>
			        <el-button 
			        	size="mini" 
			        	icon="el-icon-delete" 
			        	circle 
			        	type="warning" 
			        	@click.native.prevent="distributeDelete(scope.$index, scope.row)">
			        </el-button>
			      </template>
		      </el-table-column>
		    </el-table>
		    <div v-show="!distributeOneShow" class="g-sub-btn">
		    	<el-button class="g-top-btn" size="mini" type="primary" @click="saveBtnData()">保存</el-button>
		    </div>
			</el-col>
		</el-row>
  </div>
</template>

<script>
import {queryServerInfoList, dispatcherAPKInfo} from '@/service/iot-frame'
import {getToken, getLocalStore} from '@/util/storageUtil'
export default {
	data () {
		var checkCompCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择一个接收IP'))
      } else {
        callback()
      }
    }
		return {
			userInfo: {},
      account: '',
			activeIndex: '1',
			distributeOneShow: true,
			form: {
    	  useObject: '',
    	  acceptIp: ''
      },
      formLabelWidth: '120px',
      tableData: [{
        useObject: '',
        serverOption: [],
        selectedOption: []
      }],
      serverOption: [],
      selectedOption: [],
      props: {
	      label: 'ip',
	      value: 'id'
	    },
	    apkObj: {},
	    rules: {
        useObject: [
          {required: true, message: '请输入使用对象名称', trigger: 'blur'}
        ],
        acceptIp: [
          {validator: checkCompCode, trigger: 'blur', required: true}
        ]
      }
		}
	},
	mounted () {
		let self = this;
		self.apkObj = getToken("atPresentAPKDetails", "json")
		self.userInfo = getLocalStore("USER_INFO", "json")
    self.account = self.userInfo.account | self.userInfo.userName
		let data = {}
		let url = `?pageSize=10000&currentPage=1`
		self.queryServerlist(url, data);
	},
	methods: {
		async queryServerlist (url, data) {
			let self = this;
			let serverData = await queryServerInfoList(url, data)
			if (serverData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
			if (serverData.status == 200 && serverData.data.status == "200") {
				let serverDataLists = serverData.data.data;
				self.tableData[0].serverOption = serverDataLists
				self.serverOption = serverDataLists
			} else {
				self.$message.error(serverData.data.message)
			}
		},
		handleSelect (key, keyPath) {
			let self = this
		  key == 1 ? self.distributeOneShow = true : self.distributeOneShow = false
		},
		compOptionsChange (value) {
	    let self = this
	    if (self.selectedOption.length > 0) {
	      self.compChange(self.selectedOption[self.selectedOption.length - 1])
	    }
	  },
	  compChange (compValue) { /*改变ip*/
	  	let self = this;
	  	self.form.acceptIp = compValue
		},
		compOptionsChanges (value) {
	    let self = this
	    if (self.selectedOption.length > 0) {
	      self.compChanges(self.selectedOption[self.selectedOption.length - 1])
	    }
	  },
	  compChanges (compValue) { /*改变企业*/
		},
		distributeAdd (index, tab) {
    	let self = this;
    	let tableSingle = {
        useObject: '',
        useIP: '',
        useTime: '',
        receptionIP: '',
        serverOption: self.serverOption,
        selectedOption: []
      }
    	self.tableData.splice((index + 1), 0, tableSingle)
    },
    distributeDelete (index, tab) {
    	let self = this;
    	if (self.tableData.length <= 1) {
    		self.$message({
	        message: '删除失败！',
	        type: 'warning',
	        center: true,
	        duration: 1500
	      });
    	} else {
    		self.tableData.splice(index, 1)
    	}
    },
    async singleSure () { //单点分发确定
    	let self = this;
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            self.loading = true
            let data = [{
			    		id: self.apkObj.id,
			    		fileName: self.apkObj.fileName,
			    		pagePath: self.apkObj.pagePath,
			    		pageSize: self.apkObj.pageSize,
			    		dockerPath: self.account, //当前用户登录名
			    		dockerSize: self.selectedOption[0],
			    		user: self.form.useObject,
			    		status: '1',
			    		extension: self.apkObj.extension
			    	}]
			    	let dispatchData = await dispatcherAPKInfo(data)
			    	if (dispatchData.status !== 200) {
			        self.$message.error("服务器错误")
			        return
			      }
			    	if (dispatchData.status == 200 && dispatchData.data.status == "200") {
			    		self.$message({
			          message: dispatchData.data.message,
			          type: 'success',
			          duration: 1500,
			          center: true
			        });
			        self.selectedOption = [];
			        self.form.useObject = ''
			    	} else {
							self.$message.error(dispatchData.data.message)
						}
          } finally {
            self.loading = false
          }
        }
      })
    },
    async saveBtnData () { //多点分发确定
    	let self = this;
    	let arr = []
    	self.tableData.forEach((item, index) => {
    		let data = {
	    		id: self.apkObj.id,
	    		fileName: self.apkObj.fileName,
	    		pagePath: self.apkObj.pagePath,
	    		pageSize: self.apkObj.pageSize,
	    		dockerPath: self.account, //当前用户登录名
	    		dockerSize: item.selectedOption[0],
	    		user: item.useObject,
	    		status: '1',
    			extension: self.apkObj.extension
	    	}
	    	arr.push(data)
    	})
  		let dispatchData = await dispatcherAPKInfo(arr)
  		if (dispatchData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
    	if (dispatchData.status == 200 && dispatchData.data.status == "200") {
    		self.$message({
          message: dispatchData.data.message,
          type: 'success',
          duration: 1500,
          center: true
        });
        self.tableData = [{
	        useObject: '',
	        serverOption: self.serverOption,
	        selectedOption: []
	      }]
    	} else {
				self.$message.error(dispatchData.data.message)
			}
    }
	}
}
</script>

<style lang="scss" scoped>
  .g-form-ipt {
  	margin-top: 15px;
    .g-item-ipt {
		  width: 60%;
		  height: 35px;
    }
		.g-top-btn {
			margin-left: 120px;
		}
  }
  .g-content{
  	.g-sub-btn{
			text-align: left;
			margin-top: 20px;
			margin-left: 15px;
		}
  }
  .s-distribute-btn {
  	margin-right: 30px;
  }
  .s-sure{
  	margin-top: 5px;
  }
</style>

<style>
	.el-input__inner {
		height: 30px;
	}
</style>